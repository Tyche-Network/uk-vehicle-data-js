# UK vehicle data API for JavaScript

DVLA vehicle enquiry and DVSA MOT history in one call, from a UK registration. Each lookup also gives an estimated ULEZ / clean air zone status, mileage anomaly checks and MOT and tax expiry countdowns. You can add webhooks that fire before MOT or tax runs out.

- No dependencies. Works on Node 18+, Deno, Bun and edge runtimes.
- Free key in seconds, with 100 lookups a month: https://api.tychelabs.net/signup
- Docs: https://api.tychelabs.net/docs/vehicle

```sh
npm install github:Tyche-Network/uk-vehicle-data-js
```

```js
import { VehicleData } from '@tychelabs/uk-vehicle-data';

const api = new VehicleData({ apiKey: process.env.TYCHE_API_KEY });
const { data } = await api.lookup('AB12 CDE');

console.log(data.make, data.model, data.colour);
console.log('MOT expires', data.mot.expiryDate, `(${data.mot.daysUntilExpiry} days)`);
console.log('Tax', data.tax.status, data.tax.dueDate);
console.log('ULEZ (estimate)', data.cleanAirZone?.result);
if (data.mileage.anomalyFound) console.warn(data.mileage.anomalies);
```

A `tl_test_` key returns sandbox data for any registration and is not metered.

## Expiry webhooks

```js
await api.watch('AB12CDE', 'https://example.com/hooks/tyche', [30, 7, 1]);

// In your webhook handler (use the raw body):
import { verifyWebhook } from '@tychelabs/uk-vehicle-data';
const ok = await verifyWebhook(rawBody, req.headers['tyche-signature'], process.env.TYCHE_WEBHOOK_SECRET);
```

## Errors

Failed calls throw `TycheApiError` with `status` and `code`, for example `vehicle_not_found` (404), `quota_exceeded` (429) or `upstream_unavailable` (503, not billed).

## Data

Contains public sector information licensed under the Open Government Licence v3.0. This library is not affiliated with or endorsed by the DVLA or DVSA. Clean air zone results are estimates. Always check the official TfL or GOV.UK checker before relying on one.

MIT licence. Made by [Tyche Labs](https://www.tychelabs.net).
