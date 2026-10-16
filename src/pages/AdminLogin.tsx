import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, LockKeyhole, ArrowRight, ArrowLeft, ArrowUpRight } from "lucide-react";
import { useStoreBranding } from "@/lib/useStoreBranding";

// Whitelist — only these emails can access admin
const ALLOWED_EMAILS = [
  "hikaribrandan3@gmail.com",
  "owner@absstore.local", // Placeholder — owner adds their email after signup
];

export default function AdminLogin() {
  const navigate = useNavigate();
  const branding = useStoreBranding();
  const demoAvailable =
    !import.meta.env.VITE_RE_STORE_OWNER_ID && !import.meta.env.VITE_STORE_OWNER_ID;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Check whitelist before anything
    const isAllowed = ALLOWED_EMAILS.includes(email.toLowerCase());
    if (!isAllowed) {
      toast.error("Email no autorizado", {
        description: "Solo ciertos emails pueden acceder al admin.",
      });
      return;
    }

    setLoading(true);
    try {
      const fn =
        mode === "login"
          ? supabase.auth.signInWithPassword({ email, password })
          : supabase.auth.signUp({
              email,
              password,
              options: { emailRedirectTo: `${window.location.origin}/admin` },
            });
      const { error, data } = await fn;
      if (error) throw error;

      // For signup, verify whitelist worked
      if (mode === "signup" && data.user) {
        toast.success("Cuenta creada");
      } else {
        toast.success("Bienvenido");
      }

      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white px-6 font-sans text-[#171717]">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-9 sm:py-12">
        <img
          src={branding.logo}
          alt={branding.name}
          width="132"
          height="80"
          className="mx-auto mb-9 h-20 w-[132px] object-contain"
        />
        <div className="text-center">
          <h1 className="font-sans text-[28px] font-medium tracking-tight">Admin</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[#858585]">
            {mode === "login" ? "Ingresá para administrar tu tienda." : "Creá tu cuenta de dueño."}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className="relative">
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Mail
              size={19}
              strokeWidth={1.6}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"
            />
            <Input
              id="email"
              type="email"
              autoComplete="username"
              autoCapitalize="none"
              inputMode="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="h-14 rounded-[14px] border-[#e8e8e8] bg-white pl-12 text-base shadow-none focus-visible:ring-black/10"
            />
          </div>
          <div className="relative">
            <Label htmlFor="password" className="sr-only">
              Contraseña
            </Label>
            <LockKeyhole
              size={19}
              strokeWidth={1.6}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"
            />
            <Input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Contraseña"
              className="h-14 rounded-[14px] border-[#e8e8e8] bg-white pl-12 text-base shadow-none focus-visible:ring-black/10"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="mt-2 h-14 w-full gap-3 rounded-[14px] bg-black text-base font-medium text-white shadow-none hover:bg-black/85"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {mode === "login" ? "Ingresar" : "Crear cuenta"}
            <ArrowRight size={19} />
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 min-h-11 text-center text-[13px] text-[#888]"
        >
          {mode === "login" ? (
            <>
              ¿No tenés cuenta? <span className="font-medium text-black">Crear una</span>
            </>
          ) : (
            <>
              ¿Ya tenés cuenta? <span className="font-medium text-black">Ingresar</span>
            </>
          )}
        </button>
        {demoAvailable && (
          <Link
            to="/admin/demo"
            className="mx-auto mt-1 flex min-h-11 items-center gap-2 text-[13px] font-medium text-black"
          >
            Ver demo del panel <ArrowRight size={15} />
          </Link>
        )}
        <Link
          to="/"
          className="mx-auto mt-3 flex min-h-11 items-center gap-2 text-[13px] text-[#888]"
        >
          <ArrowLeft size={17} />
          Volver al sitio
        </Link>
      </div>
      <footer className="mx-auto w-full max-w-sm border-t border-[#e8e8e8] pb-[calc(20px+env(safe-area-inset-bottom))] pt-5">
        <a
          href="https://hikari-brandan.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center justify-center gap-2 text-[12px]"
        >
          <span className="text-[#a0a0a0]">Powered by</span>
          <span className="font-medium text-[#333]">Hikari Studio</span>
          <ArrowUpRight size={16} strokeWidth={1.6} className="text-[#999]" />
        </a>
      </footer>
    </div>
  );
}
