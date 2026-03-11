# Deployment

## Current Method
GitHub → Cloudflare Pages auto-deploy.

Push to `main` branch and Cloudflare Pages automatically builds and deploys. Live in ~1-2 minutes.

## Standard Deploy Workflow
```sh
npm run build          # verify zero build errors locally first
git add -A
git commit -m "your message"
git push               # triggers auto-deploy on Cloudflare Pages
```

## Local Dev Workflow
```sh
npm run dev            # dev server at http://localhost:4321
```

First-time local DB setup (run once):
```sh
npx wrangler d1 execute grasswhoopin-db --local --file=schema.sql
npx wrangler d1 execute grasswhoopin-db --local --file=seed.sql
```

## Notes
- Local D1 (`--local`) and production D1 (`--remote`) are completely separate — seed data never touches production
- `npm run build` must complete with zero errors before pushing
- Cloudflare Pages build uses Node 18+, npm
