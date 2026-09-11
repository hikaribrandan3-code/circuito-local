import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (searchParams.get("mode") === "reset") setMode("reset");
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && mode !== "reset") navigate("/admin", { replace: true });
    });
  }, [mode, navigate, searchParams]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    let error;
    if (mode === "signup") ({ error } = await supabase.auth.signUp({ email, password }));
    else if (mode === "forgot")
      ({ error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/login?mode=reset`,
      }));
    else if (mode === "reset") ({ error } = await supabase.auth.updateUser({ password }));
    else ({ error } = await supabase.auth.signInWithPassword({ email, password }));
    if (error) {
      toast.error(error.message);
    } else if (mode === "signup") toast.success("Revisá tu email para confirmar la cuenta.");
    else if (mode === "forgot")
      toast.success("Te enviamos un enlace para restablecer tu contraseña.");
    else if (mode === "reset") {
      toast.success("Contraseña actualizada.");
      navigate("/admin", { replace: true });
    } else navigate("/admin", { replace: true });
    setLoading(false);
  }
  const title =
    mode === "signup"
      ? "Crear cuenta"
      : mode === "forgot"
        ? "Recuperar contraseña"
        : mode === "reset"
          ? "Nueva contraseña"
          : "Administrá tu tienda";
  const button =
    mode === "signup"
      ? "Crear cuenta"
      : mode === "forgot"
        ? "Enviar enlace"
        : mode === "reset"
          ? "Guardar contraseña"
          : "Ingresar";
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border bg-card p-8 shadow-soft"
      >
        <h1 className="font-display text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Usá tu email para administrar tu tienda.
        </p>
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-6 w-full rounded-xl border bg-background px-3 py-2"
        />
        {mode !== "forgot" && (
          <input
            required
            minLength={6}
            type="password"
            placeholder={mode === "reset" ? "Nueva contraseña" : "Contraseña"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-3 w-full rounded-xl border bg-background px-3 py-2"
          />
        )}
        <button
          disabled={loading}
          className="mt-6 w-full rounded-full bg-primary py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {loading ? "Procesando…" : button}
        </button>
        {mode === "login" && (
          <button
            type="button"
            onClick={() => setMode("forgot")}
            className="mt-4 w-full text-sm underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        )}
        {mode !== "reset" && (
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            className="mt-3 w-full text-sm text-muted-foreground underline"
          >
            {mode === "signup" ? "Ya tengo una cuenta" : "Crear una cuenta"}
          </button>
        )}
      </form>
    </div>
  );
}
