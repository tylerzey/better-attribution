import { describe, vi, expect, afterEach, test } from "vitest";
import { betterAttribution } from "./index";
import cookie from "js-cookie";

describe("betterAttribution", () => {
  const getterCookie = vi.spyOn(cookie, "get");
  afterEach(() => {
    getterCookie.mockReset();
  });

  test("it gets and parses cookies", () => {
    // @ts-ignore
    getterCookie.mockReturnValue(JSON.stringify({ utm_term: "test" }));
    const attr = betterAttribution();

    expect(attr.getFirstTouch().utm_campaign).toBeUndefined();
    expect(attr.getFirstTouch().utm_term).toBe("test");
  });

  test("it gets current params", () => {
    window.location = new URL(
      "https://www.example.com?utm_term=testing",
    ) as any;
    Object.defineProperty(window.document, "referrer", {
      value: "withours.com",
    });

    const attr = betterAttribution();

    expect(attr.getCurrentParams()).toMatchInlineSnapshot(`
      {
        "referrer": "withours.com",
        "utm_term": "testing",
      }
    `);
  });
});
