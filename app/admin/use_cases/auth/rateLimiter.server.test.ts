import { describe, expect, it } from "vitest";
import { checkLoginRateLimit, clearLoginAttempts, recordFailedLogin } from "./rateLimiter.server";

// Cada test usa un ip/email únicos para no compartir estado con los demás,
// ya que el limitador guarda los contadores en un Map a nivel de módulo.
let counter = 0;
const uniqueKey = () => {
  counter += 1;
  return { ip: `10.0.0.${counter}`, email: `user${counter}@test.com` };
};

describe("rateLimiter", () => {
  it("allows the first attempt", () => {
    const { ip, email } = uniqueKey();
    expect(checkLoginRateLimit(ip, email).allowed).toBe(true);
  });

  it("still allows after a few failures below the threshold", () => {
    const { ip, email } = uniqueKey();
    for (let i = 0; i < 4; i++) recordFailedLogin(ip, email);
    expect(checkLoginRateLimit(ip, email).allowed).toBe(true);
  });

  it("blocks after 5 failed attempts", () => {
    const { ip, email } = uniqueKey();
    for (let i = 0; i < 5; i++) recordFailedLogin(ip, email);
    const result = checkLoginRateLimit(ip, email);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it("blocks by email even if the IP changes (credential-stuffing across IPs)", () => {
    const { email } = uniqueKey();
    for (let i = 0; i < 5; i++) recordFailedLogin(`10.1.0.${i}`, email);
    expect(checkLoginRateLimit("10.1.0.99", email).allowed).toBe(false);
  });

  it("blocks by IP even if the email changes (spraying across accounts)", () => {
    const { ip } = uniqueKey();
    for (let i = 0; i < 5; i++) recordFailedLogin(ip, `spray${i}@test.com`);
    expect(checkLoginRateLimit(ip, "another@test.com").allowed).toBe(false);
  });

  it("clearLoginAttempts resets the counters", () => {
    const { ip, email } = uniqueKey();
    for (let i = 0; i < 5; i++) recordFailedLogin(ip, email);
    expect(checkLoginRateLimit(ip, email).allowed).toBe(false);

    clearLoginAttempts(ip, email);
    expect(checkLoginRateLimit(ip, email).allowed).toBe(true);
  });
});
