# Linq Partner TypeScript SDK

TypeScript SDK for the Linq Partner API.

## Installation

```bash
npm install linq-partner-js
```

## Quick start

```ts
import { LinqPartnerClient } from "linq-partner-js";

const client = new LinqPartnerClient({
  apiKey: process.env.LINQ_API_KEY!
});

const chats = await client.chats.list({ from: "+12223334444" });
```

## Webhook verification

```ts
import { verifyWebhookSignature } from "linq-partner-js";

const ok = await verifyWebhookSignature({
  signingSecret: process.env.LINQ_WEBHOOK_SECRET!,
  payload: rawBody,
  timestamp: headers["x-webhook-timestamp"],
  signature: headers["x-webhook-signature"]
});
```

## Development

```bash
npm install
npm run generate:types
npm run build
npm run test
npm run typecheck
```

## CI

GitHub Actions runs CI on pull requests and pushes to `main`:
- Node 18, 20, 22
- `npm run typecheck`
- `npm test`
- `npm run build`

## Publishing

Publishing is automated via `.github/workflows/publish.yml` on tag pushes like `v0.1.0` or manual `workflow_dispatch`.

Requirements:
- Add repo secret `NPM_TOKEN` (npm automation token)
- Ensure `package.json` version matches the tag version (workflow validates this)

Local publish safety:
- `prepublishOnly` runs typecheck, tests, and build before publish.
