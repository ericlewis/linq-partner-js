# Linq Partner TypeScript SDK

TypeScript SDK for the Linq Partner API.

## Installation

```bash
npm install @ericlewis/linq-partner-js --registry=https://npm.pkg.github.com
```

## Quick start

```ts
import { LinqPartnerClient } from "@ericlewis/linq-partner-js";

const client = new LinqPartnerClient({
  apiKey: process.env.LINQ_API_KEY!
});

const chats = await client.chats.list({ from: "+12223334444" });
```

## Webhook verification

```ts
import { verifyWebhookSignature } from "@ericlewis/linq-partner-js";

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

Releases are automated by `.github/workflows/publish.yml`.

### Publish a release

1. Update `package.json` version.
2. Commit and push to `main`.
3. Create and push a tag that matches the version:

```bash
git tag v0.1.0
git push origin v0.1.0
```

### What the publish workflow does

- Runs typecheck, tests, and build.
- Verifies tag version matches `package.json` version.
- Publishes to GitHub Packages (`npm.pkg.github.com`) as `@ericlewis/linq-partner-js`.
- Creates a GitHub Release and uploads the packed npm artifact (`.tgz`).
  - `openapi/v3-reference.yaml`

### Notes

- Uses `GITHUB_TOKEN` for GitHub Packages publish (no npm token needed).
- `prepublishOnly` also enforces local safety checks before publish.
