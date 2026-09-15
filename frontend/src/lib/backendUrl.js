/**
 * Resolve BACKEND_URL at runtime.
 * Local default: http://localhost:8080
 * Render fromService may supply a bare slug or hostname without a protocol.
 *
 * Bracket access avoids Next.js statically inlining process.env.BACKEND_URL
 * at build time (which would bake localhost:8080 into the production image).
 */
export function resolveBackendUrl(raw = process.env["BACKEND_URL"]) {
  let backendUrl = raw || "http://localhost:8080";
  if (
    backendUrl &&
    !backendUrl.startsWith("http://") &&
    !backendUrl.startsWith("https://")
  ) {
    if (!backendUrl.includes(".")) {
      backendUrl = "https://" + backendUrl + ".onrender.com";
    } else {
      backendUrl = "https://" + backendUrl;
    }
  }
  return backendUrl;
}
