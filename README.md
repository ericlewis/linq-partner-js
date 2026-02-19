# Linq Partner TypeScript SDK

TypeScript SDK for the Linq Partner API.

## Installation

```bash
npm install @OWNER/linq-partner-js --registry=https://npm.pkg.github.com
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

Publishing is automated via `/Users/ericlewis/Developer/linq-partner-js/.github/workflows/publish.yml` on tag pushes like `v0.1.0` or manual `workflow_dispatch`.

Requirements:
- No extra token setup required for package publish in Actions (uses `GITHUB_TOKEN`)
- Ensure `package.json` version matches the tag version (workflow validates this)

Local publish safety:
- `prepublishOnly` runs typecheck, tests, and build before publish.

Release outputs:
- Publishes package to GitHub Packages (`npm.pkg.github.com`) as `@<repo-owner>/linq-partner-js`
- Creates a GitHub Release for tag runs and uploads:
  - packed npm artifact (`.tgz`)
  - `openapi/v3-reference.yaml`
