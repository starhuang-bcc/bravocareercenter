# BRAVO V1.0 Render migration

This branch prepares BRAVO Career Center for a split Render deployment.

## Static Site
- Branch: render-v1.0-migration (use for staging; merge to main only after validation)
- Build command: pnpm install --frozen-lockfile && pnpm vite build
- Publish directory: dist/public
- Required build env: VITE_API_BASE_URL=https://<your-api-service>.onrender.com

## API Web Service
- Build command: pnpm install --frozen-lockfile && pnpm build
- Start command: pnpm start
- Health check: /health
- Required env: DATABASE_URL, JWT_SECRET, ADMIN_PASSWORD, SMTP_PASS
- Recommended env: COMPANY_EMAIL=career@bravocareercenter.com
- CORS_ORIGINS should contain the Static Site staging URL while testing. Production domains are already allowed.

## Migration behavior
- Browser tRPC calls use VITE_API_BASE_URL instead of assuming same-origin hosting.
- API enables credentialed CORS only for approved origins and exposes /health.
- Admin password is no longer hard-coded; missing ADMIN_PASSWORD fails closed.
- SMTP success/failure is now reported truthfully.
- Contact and consultation notifications no longer require Manus notifyOwner.
- Existing database writes remain in place.
- Do not change bravocareercenter.com DNS until staging validation passes.
