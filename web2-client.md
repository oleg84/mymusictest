## Web2 Client (through HTTP API)

### API Public Endpoints

```text
https://my-public-node-1.projscale.dev
    – /api/v1
```

### Telegram WebApp Authorization

[Implementation](../app/api/routes/auth.py)

#### Request (POST, /api/v1/auth.twa, JSON)

```javascript
{
    twa_data: window.Telegram.WebApp.initData,
    ton_proof: {
        account: {
            address: string,
            ...
        },
        ton_proof: {
            signature: string,
            payload: string,
            ...
        }
    },
}
```

#### Response (JSON)

```javascript
{
    user: { ...User },
    connected_wallet: null | {
        version: string,
        address: string,
        ton_balance: string // nanoTON bignum
    },
    auth_v1_token: string
}
```

**Use** `auth_v1_token` as `Authorization` header for all authorized requests.

### New TonConnect (only with user authorization)

[Implementation](../app/api/routes/tonconnect.py)

#### Request (GET, /api/v1/tonconnect.new, Query-Params)

```javascript
{
    wallet_app_name: tonkeeper | telegram-wallet | mytonwallet | tonhub
}
```

#### Response (JSON)

```javascript
{
    connection_lin: "url",
    wallet_app_name: "selectedWallet"
}
```

### Logout Saved TonConnect

[Implementation](../app/api/routes/tonconnect.py)

#### Request (POST, /api/v1/tonconnect.logout)

#### Response

```javascript
{ success: true }
```

### Upload file

[Implementation](../app/api/routes/node_storage.py)

#### Request (POST, /api/v1/storage, FormData)

```javascript
{
    file: File
}
```

#### Response (JSON)

```javascript
{
    content_sha256: string,
    content_id_v1: string,
    content_url: string
}
```

### Download file

[Implementation](../app/api/routes/node_storage.py)

#### Request (GET, /api/v1/storage/:content\_id)

#### Response (File)

### Create new content

[Implementation](../app/api/routes/blockchain.py)

#### Request (POST, /api/v1/blockchain.sendNewContentMessage, JSON)

```javascript
{
    title: string,
    authors: list,
    content: string, // recommended dmy://
    image: string, // recommended dmy://
    description: string,
    price: string, // nanoTON bignum
    resaleLicensePrice: string // nanoTON bignum (default = 0)
    allowResale: boolean,
    royaltyParams: [{
        address: string,
        value: number // 10000 = 100%
    }]
}
```

#### Response (JSON)

```javascript
{
    message: "Transaction requested"
}
```

### View content

[Implementation](../app/api/routes/content.py)

#### Request (GET, /api/v1/content/:content\_id)

#### Response

```javascript
{
    content_type: "mime type",
    content_address: str, // onchain address of purchase contract! (use only it)
    key_hash: "encryption private key sha256 digest",
    encrypted: {
        onchain_index: int,
        owner_address: str, // owner of original content
        item_address: str, // onchain address of content
        license_type: 0, // 0 is original, not copy
        metadata_cid: str, // metadata cid
        content_cid: str, // content cid
        cover_cid: str, // cover cid,
        license: {
            listen: {
                price: str // nanoTON bignum
            }
        },
        hash: str, // sha256 of encrypted content
        cid: str, // content id in system
        content_type: str, // content type of encrypted content (dont use it)
        status: str, // status of content (dont use it)
        updated: iso_str, // updated time of content from blockchain
        created: iso_str, // created time of content from blockchain
    },
    display_options: {
        content_url: "url to fetch binary content",
        metadata: {
            ...(basically NFTMetadata)
        }
    }
}
```

### Purchase content

[Implementation](../app/api/routes/blockchain.py)

#### Request (POST, /api/v1/blockchain.sendPurchaseContentMessage, JSON)

```javascript
{
    content_address: string,
    license_type: "listen" | "resale"
}
```

#### Response (JSON)

```javascript
{
    message: "Transaction requested"
}
```
