import { useEffect, useState } from "react";
import { STORE } from "@/lib/products";
export function useStoreBranding(ownerIdOverride?: string) {
  const [branding, setBranding] = useState({
    name: import.meta.env.VITE_STORE_NAME || STORE.name,
    logo: import.meta.env.VITE_STORE_LOGO_URL || "/re-logo.svg",
  });
  useEffect(() => {
    const ownerId =
      ownerIdOverride ||
      import.meta.env.VITE_STORE_OWNER_ID ||
      import.meta.env.VITE_RE_STORE_OWNER_ID;
    if (!ownerId) return;
    let active = true;
    void (async () => {
      try {
        const { storefrontDb } = await import("@/lib/storefrontDb");
        const { data } = await storefrontDb
          .from("profiles")
          .select("contact_info,logo_url")
          .eq("id", ownerId)
          .maybeSingle();
        if (active && data)
          setBranding((current) => ({
            name: data.contact_info?.split("\n")[0]?.trim() || current.name,
            logo: data.logo_url || current.logo,
          }));
      } catch {
        /* Use the configured store branding while the profile is unavailable. */
      }
    })();
    return () => {
      active = false;
    };
  }, [ownerIdOverride]);
  return branding;
}
