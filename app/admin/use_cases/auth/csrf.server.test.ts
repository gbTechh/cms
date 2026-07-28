import { describe, expect, it } from "vitest";
import { assertCsrf, ensureCsrfToken } from "./csrf.server";
import { commitSession, getSession } from "./session.server";

async function buildRequestWithCsrfCookie() {
  const session = await getSession();
  const token = ensureCsrfToken(session);
  const cookie = await commitSession(session);
  const request = new Request("http://localhost/admin/login", {
    headers: { Cookie: cookie },
  });
  return { request, token };
}

describe("assertCsrf", () => {
  it("passes when the form token matches the session token", async () => {
    const { request, token } = await buildRequestWithCsrfCookie();
    const formData = new FormData();
    formData.set("csrf", token);

    await expect(assertCsrf(request, formData)).resolves.toBeUndefined();
  });

  it("rejects when the form token does not match", async () => {
    const { request } = await buildRequestWithCsrfCookie();
    const formData = new FormData();
    formData.set("csrf", "wrong-token");

    await expect(assertCsrf(request, formData)).rejects.toBeInstanceOf(Response);
  });

  it("rejects when the form is missing the csrf field entirely", async () => {
    const { request } = await buildRequestWithCsrfCookie();
    const formData = new FormData();

    await expect(assertCsrf(request, formData)).rejects.toBeInstanceOf(Response);
  });

  it("rejects when there is no session cookie at all", async () => {
    const request = new Request("http://localhost/admin/login");
    const formData = new FormData();
    formData.set("csrf", "anything");

    await expect(assertCsrf(request, formData)).rejects.toBeInstanceOf(Response);
  });
});
