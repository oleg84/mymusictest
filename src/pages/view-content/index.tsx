import ReactPlayer from "react-player/lazy";
import { useTonConnectUI, TonConnectUIProvider } from "@tonconnect/ui-react";
import { useMemo } from "react";
import { useWebApp } from "@vkruglikov/react-telegram-web-app";

import { Button } from "~/shared/ui/button";
import { usePurchaseContent, useViewContent } from "~/shared/services/content";
import { fromNanoTON } from "~/shared/utils";

export const ViewContentPage = () => {
  const WebApp = useWebApp();

  const { data: content } = useViewContent(WebApp.initDataUnsafe?.start_param);

  const { mutateAsync: purchaseContent } = usePurchaseContent();

  const [tonConnectUI] = useTonConnectUI();

  const transaction = useMemo(() => {
    const address = content?.data?.encrypted?.cid;

    return {
      validUntil: Math.floor(Date.now() / 1000) + 120,
      messages: [
        { amount: content?.data?.encrypted?.license?.listen?.price, address },
      ],
    };
  }, [content?.data]);

  const handleBuyContent = async () => {
    try {
      if (!tonConnectUI.connected) {
        await tonConnectUI.connect();
      }
      await tonConnectUI.sendTransaction(transaction);
    } catch (error) {
      console.error("Error buying content:", error);
    }
  };

  return (
    <TonConnectUIProvider>
      <div>
        <ReactPlayer url={content?.data?.content_url} />
        <Button onClick={handleBuyContent}>Buy Content</Button>
      </div>
    </TonConnectUIProvider>
  );
};

