import { describe, it, expect } from "vitest";
import { resolveBackendUrl } from "../../lib/backendUrl";

describe("resolveBackendUrl", () => {
  it("defaults to local Spring Boot for development", () => {
    expect(resolveBackendUrl(undefined)).toBe("http://localhost:8080");
    expect(resolveBackendUrl("")).toBe("http://localhost:8080");
  });

  it("keeps an explicit local URL unchanged", () => {
    expect(resolveBackendUrl("http://localhost:8080")).toBe(
      "http://localhost:8080"
    );
  });

  it("prepends https for a Render hostname", () => {
    expect(
      resolveBackendUrl("real-estate-backend-ibyb.onrender.com")
    ).toBe("https://real-estate-backend-ibyb.onrender.com");
  });

  it("appends .onrender.com for a bare service slug", () => {
    expect(resolveBackendUrl("real-estate-backend")).toBe(
      "https://real-estate-backend.onrender.com"
    );
  });

  it("keeps a full https URL unchanged", () => {
    expect(
      resolveBackendUrl("https://real-estate-backend-xyz.onrender.com")
    ).toBe("https://real-estate-backend-xyz.onrender.com");
  });
});
