const API_BASE = "https://server-abdurrahman482937-abdurrahman01.vercel.app";
const IMGBB_KEY = "f818b993efd7b453ce7fba64bd897530";

function getAuthHeaders(user) {
  const headers = { "Content-Type": "application/json" };
  if (!user) return headers;

  const email = user.email;
  const name = user.displayName || user.name;
  const picture = user.photoURL || user.picture;

  if (email) headers["x-user-email"] = email;
  if (name) headers["x-user-name"] = name;
  if (picture) headers["x-user-picture"] = picture;

  return headers;
}

function buildUrl(path) {
  if (!API_BASE) return path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function uploadToImgbb(file) {
  if (!file) throw new Error("No file provided to uploadToImgbb()");
  if (!IMGBB_KEY) throw new Error("ImgBB key missing. Set VITE_IMGBB_KEY in .env");

  const endpoint = `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`;

  try {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(endpoint, { method: "POST", body: fd });
    const txt = await res.text().catch(() => "");
    console.log("imgbb form-data status:", res.status, txt);
    if (!res.ok) throw new Error("ImgBB form-data upload failed");
    const json = JSON.parse(txt);
    return json?.data?.url || json?.data?.display_url || null;
  } catch (err) {
    console.warn("form-data upload failed, will try base64:", err?.message || err);
  }

  try {
    const b64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("FileReader failed"));
      reader.onload = () => {
        const res = reader.result;
        const parts = res.split(",");
        resolve(parts[1]);
      };
      reader.readAsDataURL(file);
    });

    if (!b64) throw new Error("Base64 conversion returned empty string");

    const body = new URLSearchParams();
    body.append("image", b64);

    const res2 = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: body.toString(),
    });

    const txt2 = await res2.text().catch(() => "");
    console.log("imgbb base64 status:", res2.status, txt2);
    if (!res2.ok) throw new Error("ImgBB base64 upload failed");
    const json2 = JSON.parse(txt2);
    return json2?.data?.url || json2?.data?.display_url || null;
  } catch (err) {
    console.error("ImgBB upload final error:", err?.message || err);
    throw err;
  }
}

export async function listFoods(opts = {}) {
  const qs = new URLSearchParams();
  if (opts.status) qs.set("status", opts.status);
  if (opts.donatorEmail) qs.set("donatorEmail", opts.donatorEmail);
  const url = buildUrl(`/api/foods${qs.toString() ? "?" + qs.toString() : ""}`);
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Failed to load foods");
  }
  return res.json();
}

export async function getFoodById(id) {
  if (!id) throw new Error("Missing id");
  const url = buildUrl(`/api/foods/${id}`);
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Failed to load food");
  }
  return res.json();
}

export async function createFood(foodData, user) {
  const url = buildUrl("/api/foods");
  const headers = getAuthHeaders(user);
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(foodData),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    try {
      const j = await res.json().catch(() => null);
      throw new Error((j && (j.error || j.message)) || txt || "Create food failed");
    } catch {
      throw new Error(txt || `Create food failed (status ${res.status})`);
    }
  }
  return res.json();
}

export async function updateFood(id, updates, user) {
  if (!id) throw new Error("Missing id");
  const url = buildUrl(`/api/foods/${id}`);
  const headers = getAuthHeaders(user);
  const res = await fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Update failed");
  }
  return res.json();
}

export async function deleteFood(id, user) {
  if (!id) throw new Error("Missing id");
  const url = buildUrl(`/api/foods/${id}`);
  const headers = getAuthHeaders(user);
  const res = await fetch(url, { method: "DELETE", headers });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Delete failed");
  }
  return res.json();
}

export async function getMyFoods(user) {
  const url = buildUrl("/api/foods/my/list/me");
  const headers = getAuthHeaders(user);
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Failed to fetch my foods");
  }
  return res.json();
}

export async function submitRequest(foodId, payload, user) {
  if (!foodId) throw new Error("Missing foodId");
  const url = buildUrl(`/api/foods/${foodId}/requests`);
  const headers = getAuthHeaders(user);
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Failed to submit request");
  }
  return res.json();
}

export async function getFoodRequests(foodId, user) {
  if (!foodId) throw new Error("Missing foodId");
  const url = buildUrl(`/api/foods/${foodId}/requests`);
  const headers = getAuthHeaders(user);
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Failed to fetch requests");
  }
  return res.json();
}

export async function updateRequestStatus(requestId, status, user) {
  if (!requestId) throw new Error("Missing requestId");
  if (!["accepted", "rejected", "pending"].includes(status)) throw new Error("Invalid status");
  const url = buildUrl(`/api/requests/${requestId}`);
  const headers = getAuthHeaders(user);
  const res = await fetch(url, { method: "PATCH", headers, body: JSON.stringify({ status }) });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Failed to update request");
  }
  return res.json();
}

export async function getMyRequests(user) {
  const url = buildUrl("/api/my/requests");
  const headers = getAuthHeaders(user);
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Failed to fetch my requests");
  }
  return res.json();
}

export default {
  listFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  getMyFoods,
  submitRequest,
  getFoodRequests,
  updateRequestStatus,
  getMyRequests,
  uploadToImgbb,
};
