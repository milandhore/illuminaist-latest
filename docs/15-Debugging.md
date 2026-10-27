# Debugging

## Build or dependency failure

Delete only the local `node_modules` directory if needed, rerun `npm ci`, then
run `npm run check`. Do not modify the lockfile manually unless npm cannot
reconcile it.

## GitHub Pages blank screen

Check that the Pages source is **GitHub Actions**, the workflow ran from
`main`, and the generated asset URLs include the repository base path. Because
the app uses `HashRouter`, application routes should use `/#/route` links.

## Subscription behavior

Without `VITE_SUBSCRIPTION_API_URL`, subscription state is intentionally local
to the browser. That is expected for the static demo and is not durable email
delivery or secure entitlement verification.
