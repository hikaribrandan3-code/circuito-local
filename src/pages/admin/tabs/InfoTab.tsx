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
  description: string | null;
  instagram_handle: string | null;
  instagram_url: string | null;
};

const CARD_DESIGNS = [
  { id: 1, name: "Minimalist Dark" },
  { id: 2, name: "Bold Typography" },
  { id: 3, name: "Modern Split" },
  { id: 4, name: "Elegant Stripe" },
  { id: 5, name: "Industrial" },
];

export default function InfoTab({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile>({
    id: userId,
    phone: "",
    contact_info: "",
    shop_url: typeof window !== "undefined" ? window.location.origin : "",
    logo_url: "",
    description: "",
    instagram_handle: "",
    instagram_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(1);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle().then(({ data }) => {
      if (data) setProfile(data as Profile);
    });
  }, [userId]);

  const shopUrl = profile.shop_url || (typeof window !== "undefined" ? window.location.origin : "");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      phone: profile.phone,
      contact_info: profile.contact_info,
      shop_url: profile.shop_url,
      logo_url: profile.logo_url,
      description: profile.description,
      instagram_handle: profile.instagram_handle,
      instagram_url: profile.instagram_url,
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
    a.download = "asb-store-qr.png";
    a.click();
  }

  function printCard() {
    window.print();
  }

  const set = (k: keyof Profile, v: string) => setProfile((p) => ({ ...p, [k]: v }));

  const truncateText = (text: string, lines: number = 2) => {
    const lineArray = text.split('\n').slice(0, lines);
    return lineArray.join('\n');
  };

  const cardName = profile.contact_info?.split('\n')[0] || "ASB Store";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Información</h1>
        <p className="text-sm text-muted-foreground mt-1">Datos del negocio que se muestran en el sitio y tarjetas.</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={save} className="rounded-2xl bg-card border border-border p-5 shadow-soft space-y-4">
        <h2 className="font-display text-xl">Contacto y Descripción</h2>
        <div className="space-y-2">
          <Label>Nombre del negocio</Label>
          <Input
            value={cardName}
            onChange={(e) => setProfile(p => ({ ...p, contact_info: e.target.value + (p.contact_info?.slice(p.contact_info.indexOf('\n')) || '') }))}
            placeholder="ASB Store"
            className="rounded-full"
          />
        </div>
        <div className="space-y-2">
          <Label>Descripción (aparece en la tarjeta)</Label>
          <Textarea
            rows={3}
            value={profile.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Regalos curados, libros, flores, mate y accesorios argentinos. Todo lo que necesitás para los momentos especiales."
            className="rounded-2xl text-xs"
          />
          <p className="text-[10px] text-muted-foreground">Máximo 2-3 líneas (se trunca en la tarjeta)</p>
        </div>
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
          <Label>Instagram URL</Label>
          <Input
            value={profile.instagram_url ?? ""}
            onChange={(e) => set("instagram_url", e.target.value)}
            placeholder="https://instagram.com/asbstore"
            className="rounded-full"
          />
        </div>
        <div className="space-y-2">
          <Label>Información adicional</Label>
          <Textarea
            rows={2}
            value={profile.contact_info?.split('\n').slice(1).join('\n') ?? ""}
            onChange={(e) => setProfile(p => ({ ...p, contact_info: (p.contact_info?.split('\n')[0] || cardName) + '\n' + e.target.value }))}
            placeholder="Dirección, horarios, Instagram, etc."
            className="rounded-2xl text-xs"
          />
        </div>
        <Button type="submit" disabled={saving} className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90">
          <Save className="h-4 w-4 mr-2" /> {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>

      {/* Card Design Selector */}
      <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
        <h2 className="font-display text-xl mb-4">Estilo de tarjeta</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CARD_DESIGNS.map((design) => (
            <button
              key={design.id}
              onClick={() => setSelectedDesign(design.id)}
              className={`p-3 rounded-xl text-xs font-medium transition-all ${
                selectedDesign === design.id
                  ? "bg-foreground text-background ring-2 ring-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
              }`}
            >
              {design.name}
            </button>
          ))}
        </div>
      </div>

      {/* Business Card Preview */}
      <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
        <h2 className="font-display text-xl mb-4">Tarjeta de presentación</h2>

        {/* Card Preview */}
        <div id="business-card-print" className="relative mx-auto overflow-hidden rounded-2xl shadow-elegant"
          style={{ width: "340px", height: "190px" }}>

          {/* Design 1: Minimalist Dark */}
          {selectedDesign === 1 && (
            <div style={{ background: "linear-gradient(135deg, oklch(0.15 0.01 60) 0%, oklch(0.2 0.015 50) 100%)", color: "oklch(0.95 0.008 85)" }} className="absolute inset-0 p-6 flex flex-col justify-between">
              <div>
                <p style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em", margin: 0, lineHeight: 1 }}>{cardName}</p>
                <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.6, marginTop: "4px" }}>
                  {truncateText(profile.description || "curated gifts", 1).split('\n')[0].substring(0, 20)}
                </p>
              </div>
              <div className="flex items-end justify-between">
                <div style={{ fontSize: "0.7rem", opacity: 0.8 }}>
                  {profile.phone && <p style={{ margin: 0 }}>📱 {profile.phone}</p>}
                  {profile.description && (
                    <p style={{ margin: "2px 0 0 0", fontSize: "0.65rem", opacity: 0.6 }}>
                      {truncateText(profile.description, 1).substring(0, 30)}...
                    </p>
                  )}
                </div>
                <div className="bg-white rounded p-1">
                  <QRCodeCanvas value={shopUrl} size={40} level="H" />
                </div>
              </div>
            </div>
          )}

          {/* Design 2: Bold Typography */}
          {selectedDesign === 2 && (
            <div style={{ background: "oklch(0.12 0.008 260)", color: "oklch(0.98 0.006 85)" }} className="absolute inset-0 p-6 flex flex-col justify-between">
              <div style={{ borderLeft: "4px solid oklch(0.78 0.13 80)", paddingLeft: "12px" }}>
                <p style={{ fontSize: "1.8rem", fontWeight: 900, margin: 0, textTransform: "uppercase", letterSpacing: "-0.01em" }}>
                  {cardName.substring(0, 15)}
                </p>
                {profile.description && (
                  <p style={{ fontSize: "0.65rem", margin: "6px 0 0 0", opacity: 0.8, lineHeight: 1.3 }}>
                    {truncateText(profile.description, 2).substring(0, 35)}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div style={{ fontSize: "0.65rem" }}>
                  {profile.phone && <p style={{ margin: 0 }}>{profile.phone}</p>}
                </div>
                <div className="bg-white rounded-lg p-1.5" style={{ background: "oklch(0.78 0.13 80)" }}>
                  <QRCodeCanvas value={shopUrl} size={44} level="H" />
                </div>
              </div>
            </div>
          )}

          {/* Design 3: Modern Split */}
          {selectedDesign === 3 && (
            <div style={{ background: "oklch(0.18 0.012 60)" }} className="absolute inset-0 flex">
              <div style={{ flex: 1.2, background: "oklch(0.12 0.008 260)", color: "oklch(0.98 0.006 85)", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0, letterSpacing: "-0.01em" }}>{cardName}</p>
                </div>
                <div style={{ fontSize: "0.65rem", opacity: 0.8 }}>
                  {profile.phone && <p style={{ margin: 0 }}>{profile.phone}</p>}
                </div>
              </div>
              <div style={{ flex: 0.8, padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", color: "oklch(0.95 0.008 85)" }}>
                <div style={{ fontSize: "0.55rem", textAlign: "center", lineHeight: 1.2 }}>
                  {profile.description && truncateText(profile.description, 2).substring(0, 25)}
                </div>
                <div className="bg-white rounded" style={{ padding: "3px" }}>
                  <QRCodeCanvas value={shopUrl} size={36} level="H" />
                </div>
              </div>
            </div>
          )}

          {/* Design 4: Elegant Stripe */}
          {selectedDesign === 4 && (
            <div style={{ background: "oklch(0.2 0.015 50)" }} className="absolute inset-0 p-6 flex flex-col justify-between">
              <div style={{ borderBottom: "2px solid oklch(0.78 0.13 80)", paddingBottom: "8px" }}>
                <p style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0, color: "oklch(0.98 0.006 85)", letterSpacing: "-0.01em" }}>
                  {cardName}
                </p>
              </div>
              <div style={{ color: "oklch(0.95 0.008 85)" }}>
                {profile.description && (
                  <p style={{ fontSize: "0.65rem", margin: "0 0 6px 0", opacity: 0.8, lineHeight: 1.3 }}>
                    {truncateText(profile.description, 2).substring(0, 40)}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  {profile.phone && <p style={{ fontSize: "0.7rem", margin: 0 }}>📱 {profile.phone}</p>}
                  <div className="bg-white rounded" style={{ padding: "2px" }}>
                    <QRCodeCanvas value={shopUrl} size={36} level="H" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Design 5: Industrial */}
          {selectedDesign === 5 && (
            <div style={{ background: "oklch(0.1 0.005 60)", color: "oklch(0.98 0.006 85)" }} className="absolute inset-0 p-5 flex flex-col justify-between">
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "start" }}>
                <div>
                  <p style={{ fontSize: "1.5rem", fontWeight: 900, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {cardName.substring(0, 12)}
                  </p>
                  {profile.description && (
                    <p style={{ fontSize: "0.6rem", margin: "4px 0 0 0", opacity: 0.7, lineHeight: 1.2, fontFamily: "monospace" }}>
                      {truncateText(profile.description, 1).substring(0, 30)}
                    </p>
                  )}
                </div>
                <div className="bg-white rounded" style={{ padding: "2px" }}>
                  <QRCodeCanvas value={shopUrl} size={38} level="H" />
                </div>
              </div>
              <div style={{ fontSize: "0.65rem", opacity: 0.8, borderTop: "1px solid oklch(0.98 0.006 85 / 20%)", paddingTop: "6px" }}>
                {profile.phone && <p style={{ margin: 0 }}>{profile.phone}</p>}
              </div>
            </div>
          )}
        </div>

        <Button onClick={printCard} variant="outline" className="mt-4 w-full rounded-full">
          <Printer className="h-4 w-4 mr-2" /> Imprimir tarjeta
        </Button>
      </div>

      {/* QR Sticker */}
      <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
        <h2 className="font-display text-xl mb-1">Código QR para stickers</h2>
        <p className="text-xs text-muted-foreground mb-4">Descargá el QR y llevalo a imprimir en el local de stickers.</p>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div ref={qrRef} className="bg-white rounded-2xl p-4 border border-border shadow-soft">
            <QRCodeCanvas value={shopUrl} size={160} level="H" includeMargin />
          </div>
          <div className="space-y-3 text-center sm:text-left">
            <Button onClick={downloadQR} className="rounded-full w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" /> Descargar QR (PNG)
            </Button>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #business-card-print { display: block !important; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; margin: 0; border-radius: 0; }
        }
      `}</style>
    </div>
  );
}
