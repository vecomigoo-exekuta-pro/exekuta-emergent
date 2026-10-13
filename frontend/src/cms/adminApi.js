const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "exk_admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = typeof data.detail === "string" ? data.detail : "Erro inesperado. Tente novamente.";
    if (res.status === 401) setToken(null);
    throw new Error(msg);
  }
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = typeof data.detail === "string" ? data.detail : "Não foi possível entrar.";
    throw new Error(msg);
  }
  setToken(data.token);
  return data;
}

export const logout = () => setToken(null);
export const me = () => request("/admin/me");
export const getCms = () => request("/admin/cms");
export const saveCms = (scope, data) => request(`/admin/cms/${scope}`, { method: "PUT", body: { data } });
export const getBackups = (scope) => request(`/admin/cms/backups/${scope}`);
export const restoreBackup = (scope, id) => request(`/admin/cms/backups/${scope}/${id}/restore`, { method: "POST" });
export const getMedia = () => request("/admin/media");
export const deleteMedia = (id) => request(`/admin/media/${id}`, { method: "DELETE" });

export async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API}/admin/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Falha no upload");
  return data;
}
