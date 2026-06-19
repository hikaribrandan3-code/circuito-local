import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Download, Printer, Save } from "lucide-react";

type Profile = {
  id: string;
  phone: string | null;
  contact_info: string | null;
  shop_url: string | null;
  logo_url: string | null;
};

export default function InfoTab({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile>({
    id: userId,
    phone: "",
    contact_info: "",
    shop_url: typeof window !== "undefined" ? window.location.origin : "",
    logo_url: "",
  });
  const [saving, setSaving] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle().then(({ data }) => {
      if (data) setProfile(data as Profile);
    });
  }, [userId]);

  const shopUrl = profile.shop_url || window.location.origin;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      phone: profile.phone,
      contact_info: profile.contact_info,
      shop_url: profile.shop_url,
      logo_url: profile.logo_url,
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Información guardada");
  }

  function downloadQR() {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "abs-store-qr.png";
    a.click();
  }

  function printCard() {
    window.print();
  }

  const set = (k: keyof Profile, v: string) => setProfile((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Información</h1>
        <p className="text-sm text-muted-foreground mt-1">Datos del negocio que se muestran en el sitio.</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={save} className="rounded-2xl bg-card border border-border p-5 shadow-soft space-y-4">
        <h2 className="font-display text-xl">Contacto</h2>
        <div className="space-y-2">
          <Label>Teléfono / WhatsApp</Label>
          <Input
            value={profile.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+54 9 335 493 5475"
            className="rounded-full"
          />
        </div>
        <div className="space-y-2">
          <Label>Información adicional</Label>
          <Textarea
            rows={3}
            value={profile.contact_info ?? ""}
            onChange={(e) => set("contact_info", e.target.value)}
            placeholder="Dirección, horarios, Instagram, etc."
            className="rounded-2xl"
          />
        </div>
        <div className="space-y-2">
          <Label>URL del shop</Label>
          <Input
            value={profile.shop_url ?? ""}
            onChange={(e) => set("shop_url", e.target.value)}
            placeholder="https://absstore.vercel.app"
            className="rounded-full"
          />
        </div>
        <div className="space-y-2">
          <Label>Logo (URL de imagen)</Label>
          <Input
            value={profile.logo_url ?? ""}
            onChange={(e) => set("logo_url", e.target.value)}
            placeholder="https://..."
            className="rounded-full"
          />
          {profile.logo_url && (
            <img src={profile.logo_url} alt="Logo" className="h-16 w-16 rounded-xl object-cover border border-border" />
          )}
        </div>
        <Button type="submit" disabled={saving} className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90">
          <Save className="h-4 w-4 mr-2" /> {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>

      {/* QR Sticker */}
      <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
        <h2 className="font-display text-xl mb-1">Código QR para stickers</h2>
        <p className="text-xs text-muted-foreground mb-4">Descargá el QR y llevalo a imprimir en el local de stickers.</p>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div ref={qrRef} className="bg-white rounded-2xl p-4 border border-border shadow-soft">
            <QRCodeCanvas value={shopUrl} size={160} level="H" includeMargin />
          </div>
          <div className="space-y-3 text-center sm:text-left">
            <p className="text-xs text-muted-foreground break-all">{shopUrl}</p>
            <Button onClick={downloadQR} className="rounded-full w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" /> Descargar QR (PNG)
            </Button>
          </div>
        </div>
      </div>

      {/* Business Card */}
      <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
        <h2 className="font-display text-xl mb-1">Tarjeta de presentación</h2>
        <p className="text-xs text-muted-foreground mb-4">Imprimí tu tarjeta y repartila. Hacé clic en "Imprimir" para enviarla a la impresora.</p>

        {/* Card Preview */}
        <div id="business-card-print" className="relative mx-auto overflow-hidden rounded-2xl shadow-elegant"
          style={{ width: "340px", height: "190px", background: "oklch(0.18 0.012 60)", color: "oklch(0.98 0.006 85)", fontFamily: "var(--font-display)" }}>
          {/* Front side */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                {profile.logo_url ? (
                  <img src={profile.logo_url} alt="Logo" className="h-10 w-10 rounded-lg object-cover mb-2" />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center mb-2">
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "oklch(0.78 0.13 80)" }}>A</span>
                  </div>
                )}
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 500, letterSpacing: "-0.01em", color: "oklch(0.98 0.006 85)" }}>ABS Store</p>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(0.78 0.13 80)", marginTop: "2px" }}>Regalos curados</p>
              </div>
              <div className="bg-white rounded-lg p-1.5">
                <QRCodeCanvas value={shopUrl} size={52} level="H" />
              </div>
            </div>
            <div style={{ borderTop: "1px solid oklch(0.98 0.006 85 / 20%)", paddingTop: "10px" }}>
              <div className="flex flex-col gap-0.5">
                {profile.phone && (
                  <p style={{ fontSize: "0.7rem", color: "oklch(0.98 0.006 85 / 80%)" }}>📱 {profile.phone}</p>
                )}
                {profile.contact_info && (
                  <p style={{ fontSize: "0.65rem", color: "oklch(0.98 0.006 85 / 60%)" }} className="line-clamp-1">{profile.contact_info}</p>
                )}
                <p style={{ fontSize: "0.65rem", color: "oklch(0.78 0.13 80)" }}>{shopUrl}</p>
              </div>
            </div>
          </div>

          {/* Decorative accent */}
          <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full opacity-10"
            style={{ background: "oklch(0.78 0.09 235)" }} />
          <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full opacity-10"
            style={{ background: "oklch(0.78 0.13 80)" }} />
        </div>

        <Button onClick={printCard} variant="outline" className="mt-4 w-full rounded-full">
          <Printer className="h-4 w-4 mr-2" /> Imprimir tarjeta
        </Button>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #business-card-print { display: block !important; position: fixed; top: 0; left: 0; }
        }
      `}</style>
    </div>
  );
}
