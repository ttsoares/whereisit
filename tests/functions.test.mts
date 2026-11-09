// Run with: npm test   (Node >= 22.18 runs TypeScript directly)
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fixName, wildcardMatch } from "../app/lib/functions.ts";

describe("fixName", () => {
  it("pads numbers to 3 digits and adds DVD-", () => {
    assert.equal(fixName("7"), "DVD-007");
    assert.equal(fixName("57"), "DVD-057");
    assert.equal(fixName("950"), "DVD-950");
    assert.equal(fixName("1000"), "DVD-1000");
  });
  it("trims and keeps names that already contain DVD", () => {
    assert.equal(fixName("  DVD-123 "), "DVD-123");
    assert.equal(fixName("DVD-60"), "DVD-60"); // not padded: DVD_NAME rejects it later
  });
  it("returns null for empty input", () => {
    assert.equal(fixName(""), null);
    assert.equal(fixName("   "), null);
  });
});

describe("wildcardMatch", () => {
  it("matches the whole name, case-insensitive", () => {
    assert.ok(wildcardMatch("tesla", "TESLA"));
    assert.ok(!wildcardMatch("tesla", "Tesla.avi"));
  });
  it("* matches any characters, including none", () => {
    assert.ok(wildcardMatch("*Tesla*", "Nikola_TESLA_doc.avi"));
    assert.ok(wildcardMatch("*.avi", "a.avi"));
    assert.ok(!wildcardMatch("*.avi", "a.avi.txt"));
    assert.ok(wildcardMatch("*a*b*c", "xaybzc"));
    assert.ok(!wildcardMatch("*a*b*c", "xcybza"));
    assert.ok(wildcardMatch("*", ""));
    assert.ok(wildcardMatch("**", "anything"));
  });
  it("prefix and suffix must not overlap", () => {
    assert.ok(!wildcardMatch("ab*ab", "ab"));
    assert.ok(wildcardMatch("ab*ab", "abab"));
  });
  it("treats regex characters literally", () => {
    assert.ok(wildcardMatch("a(b*", "A(bc"));
    assert.ok(!wildcardMatch("a.b", "aXb"));
    assert.ok(!wildcardMatch("(", "x"));
  });
  it("stays fast on patterns that would backtrack in a regex", () => {
    const t = Date.now();
    wildcardMatch("*a*a*a*a*a*a*a*a*a*a*X", "a".repeat(5000));
    assert.ok(Date.now() - t < 100);
  });
});
