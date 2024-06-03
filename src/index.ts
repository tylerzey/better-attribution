import type { CookieAttributes } from "js-cookie";
import Cookie from "js-cookie";
import { isNotNil } from "./isNotNil";

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
] as const;

export interface BetterAttribution<T extends readonly string[]> {
  /**
   * A list of query params to store from the url
   * You can import {DefaultQueryParams} from 'better-attribution' if you'd like to add onto our list.
   *
   * @example [... DefaultQueryParams, 'utm_source', 'utm_medium', 'utm_campaign']
   **/
  queryParams?: T;
  /**
   * A prefix to add to the cookie keys. This is useful if you want to use this library multiple times.
   * The first and last touch keys will be prefixed with this value.
   * @example bobs_widgets becomes bobs_widgets_first_touch
   */
  cookiePrefix?: string;
  /**
   * The domain to set the cookie on. Defaults to the current domain.
   * @example .example.com
   **/
  domain?: string;
}

export const betterAttribution = <
  T extends readonly string[] = typeof DefaultQueryParams,
>(
  opts?: BetterAttribution<T>,
) => {
  const vendor = opts?.cookiePrefix || "internal";
  const firstTouchKey = `${vendor}_first_touch`;
  const lastTouchKey = `${vendor}_last_touch`;
  const gcIdKey = `${vendor}_gc_id`;
  const fbclidKey = `${vendor}_fbclid`;

  const queryParams = opts?.queryParams || DefaultQueryParams;

  const cookieOpts: CookieAttributes = {
    domain: opts?.domain,
    expires: 365,
    sameSite: "lax",
    secure: false,
  };

  const getFirstTouch = (): Record<T[number], string | undefined> => {
    const f = Cookie.get(firstTouchKey);
    const object = f ? JSON.parse(f) : {};
    return object;
  };

  const getLastTouch = (): Record<T[number], string | undefined> => {
    const l = Cookie.get(lastTouchKey);
    const object = l ? JSON.parse(l) : {};
    return object;
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


    if (val.fbclid) {
      Cookie.set(fbclidKey, val.fbclid, cookieOpts);
    }

    if (val.gclid) {
      Cookie.set(gcIdKey, val.gclid, cookieOpts);
    }
  };

  return {
    firstTouchKey,
    lastTouchKey,
    getLastTouch,
    getFirstTouch,
    getCurrentParams,
    storeAttributionValues,
  };
};
