# better-attribution

[![npm version](https://badgen.net/npm/v/better-attribution)](https://npm.im/better-attribution) [![npm downloads](https://badgen.net/npm/dm/better-attribution)](https://npm.im/better-attribution)

## Using this package

```js
import { betterAttribution, DefaultQueryParams } from "better-attribution";

const attr = betterAttribution();

// Stores the current URL query params and referrer in a cross site cookie
attr.storeAttributionValues();

// JSON from the latest visit
const lastParams = attr.getLastTouch();
console.log(lastParams); // {referrer: 'facebook.com', fbclid: 'abc-123'}

// JSON from the first visit
const firstParams = attr.getFirstTouch();
console.log(firstParams); // {utm_term: 'first-visit-term', referrer: 'google.com'}
```

Features:

- Uses cookies to store visitors query params and the referrer for attribution tracking
- Exposes methods to retrieve the last and first touch attribution data
- Allows you to override collected query params
- Allows you to submit to your analytics platform or on form submissions additional info about how the user found your site for the first and most recent time.
- Enables MMM (marketing mix modeling) // MTA (multi-touch attribution)
- Tracks the document referrer

Default list of tracked query params (you can override this in the setup function):

- utm_source
- utm_medium
- utm_campaign
- utm_content
- utm_name
- utm_term
- fbclid
- ad_id
- gclid
- gc_id

Customization:

```js
// All arguments are optional
const attr = betterAttribution({
  // allows tracking of additional (or fewer) query params
  queryParams: [...DefaultQueryParams, "custom_known_query_param"] as const,
  // allows prefixing the cookie w a custom string
  cookiePrefix: "custom_prefix",
  // allows setting the cookie w a custom domain
  domain: "example_2.com",
});
attr.getFirstTouch().custom_known_query_param // undefined | string
```

## Install

```bash
npm i better-attribution
```

## License

MIT
