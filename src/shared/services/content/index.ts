import { useMutation, useQuery } from "react-query";
import { request } from "~/shared/libs";

type UseCreateNewContentPayload = {
  title: string;
  content: string;
  image: string;
  description: string;
  price: string;
  resaleLicensePrice: string;
  allowResale: boolean;
  authors: string[];
  royaltyParams: {
    address: string;
    value: number; // 10000 = 100%
  }[];
};

export const useCreateNewContent = () => {
  return useMutation(
    ["create-new-content"],
    (payload: UseCreateNewContentPayload) => {
      return request.post<{ message: string }>("/api/v1/blockchain.sendNewContentMessage", payload);
    }
  );
};

export const useViewContent = (contentId: string) => {
  return useQuery(["view", "content", contentId], () => {
    return request.get(`https://my-public-node-1.projscale.dev/api/v1/content/${contentId}`);
  });
};

export const usePurchaseContent = () => {
  return useMutation(
    ["purchase", "content"],
    ({
      content_address,
      license_type,
    }: {
      content_address: string;
      license_type: "listen" | "resale";
    }) => {
      return request.post("https://my-public-node-1.projscale.dev/api/v1/blockchain.sendPurchaseContentMessage", {
        content_address,
        license_type,
      });
    }
  );
};
