import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
  }, [navigate]);
  async function signIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/admin` },
    });
    if (error) {
      setLoading(false);
      toast.error(error.message);
    }
  }
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm rounded-3xl border bg-card p-8 shadow-soft">
        <h1 className="font-display text-3xl">Administrá tu tienda</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ingresá con Google para crear y gestionar tu storefront.
        </p>
        <button
          disabled={loading}
          onClick={signIn}
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-full border bg-background py-3 font-medium disabled:opacity-50"
        >
          <span className="font-bold text-[#4285f4]">G</span>
          {loading ? "Redirigiendo…" : "Continuar con Google"}
        </button>
      </div>
    </div>
  );
}
