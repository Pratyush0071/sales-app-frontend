const BASE = "/api";

async function request(method, path, body) {
  const options = {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };
  if (body !== undefined) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  // Return blob for file downloads
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("spreadsheet") || ct.includes("octet-stream")) return res.blob();
  return res.json();
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path) => request("DELETE", path),
};
