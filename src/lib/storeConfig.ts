export const authConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
export const demoStore =
  !authConfigured ||
  (!import.meta.env.VITE_RE_STORE_OWNER_ID && !import.meta.env.VITE_STORE_OWNER_ID);
export const adminEntry = demoStore ? "/admin/demo" : "/admin/login";
