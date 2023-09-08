import type { CookieAttributes } from "js-cookie";
import Cookie from "js-cookie";
import { isNotNil } from "./isNotNil";
import { prefixObject } from "./prefixObject";

export const DefaultQueryParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_name",
  "utm_term",
  "fbclid",
  "ad_id",
  "gclid",
  "gc_id",
];

export const betterAttribution = (opts?: {
  queryParams?: string[];
  cookiePrefix?: string;
  domain?: string;
}) => {
  const vendor = opts?.cookiePrefix || "internal";
  const firstTouchKey = `${vendor}_first_touch`;
  const lastTouchKey = `${vendor}_last_touch`;

  const queryParams = opts?.queryParams || DefaultQueryParams;

  const cookieOpts: CookieAttributes = {
    domain: opts?.domain,
    expires: 365,
    sameSite: "lax",
    secure: false,
  };

  const getFirstTouch = (): Record<string, string> => {
    const f = Cookie.get(firstTouchKey);
    const object = f ? JSON.parse(f) : {};
    return prefixObject("first_", object);
  };

  const getLastTouch = (): Record<string, string> => {
    const l = Cookie.get(lastTouchKey);
    const object = l ? JSON.parse(l) : {};
    return prefixObject("last_", object);
  };

  const getCurrentParams = () => {
    const sp = new URLSearchParams(window.location.search);
    const paramsWithValue = queryParams
      .map((param) => {
        const value = sp.get(param);
        return value ? { param, value } : undefined;
      })
      .filter(isNotNil);

    const referrer = window.document.referrer;
    if (referrer) {
      paramsWithValue.push({ param: "referrer", value: referrer });
    }

    return paramsWithValue.reduce(
      (acc, cur) => {
        acc[cur.param] = cur.value;
        return acc;
      },
      {} as Record<string, string>,
    );
  };

  const storeAttributionValues = () => {
    const val = getCurrentParams();
    if (Object.keys(val).length === 0) {
      console.debug("no params to store");
      return;
    }

    const hasFirstTouch = Cookie.get(firstTouchKey);
    if (!hasFirstTouch) {
      console.debug("storing first touch", val);
      Cookie.set(firstTouchKey, JSON.stringify(val), cookieOpts);
    }

    console.debug("storing last touch", val);
    Cookie.set(lastTouchKey, JSON.stringify(val), cookieOpts);
  };

  return {
    getLastTouch,
    getFirstTouch,
    getCurrentParams,
    storeAttributionValues,
  };
};
