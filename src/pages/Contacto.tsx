import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Phone, MessageCircle, Instagram, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { STORE } from "@/lib/products";

export default function Contacto() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [profile, setProfile] = useState<{ phone?: string; instagram_url?: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.from("profiles").select("phone,instagram_url").limit(1).maybeSingle();
      if (data) setProfile(data);
    }
    loadProfile();
  }, []);

  const phone = profile?.phone || STORE.phone;
  const whatsapp = (profile?.phone || STORE.phone).replace(/\D/g, "");
  const instagram = profile?.instagram_url || `https://instagram.com/${STORE.instagram.replace("@", "")}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hola ${STORE.name}, soy ${form.name} (${form.phone}).\n\n${form.message}`,
    );
    window.open(`https://wa.me/${whatsapp}?text=${text}`, "_blank");
    toast.success("¡Listo!", { description: "Te abrimos WhatsApp con tu mensaje." });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 lg:px-8 py-12 md:py-20">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Contactanos</span>
        <h1 className="mt-2 font-display text-5xl md:text-6xl leading-tight">
          Charlemos sobre tu <span className="serif-italic">regalo.</span>
        </h1>
        <p className="mt-4 text-foreground/80 leading-relaxed">
          Contanos qué tenés en mente y te respondemos en el día. Hacemos pedidos a medida,
          ramos personalizados y cajas curadas para ocasiones especiales.
        </p>
      </motion.div>

      <div className="mt-12 grid lg:grid-cols-[1fr_360px] gap-10">
        <form onSubmit={submit} className="rounded-3xl bg-card border border-border p-6 md:p-10 shadow-soft space-y-5">
          <div>
            <Label>Tu nombre</Label>
            <Input
              required
              className="mt-2 rounded-full"
              placeholder="¿Cómo te llamás?"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input
              required
              className="mt-2 rounded-full"
              placeholder="+54 9 11 0000-0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <Label>Tu mensaje</Label>
            <Textarea
              required
              rows={5}
              className="mt-2 rounded-2xl"
              placeholder="Contanos para quién es el regalo, qué le gusta y cuándo lo necesitás."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <Button size="lg" type="submit" className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium">
            Enviar por WhatsApp
          </Button>
        </form>

        <aside className="space-y-4">
          {/* Instagram — top, prominent */}
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600 text-white p-5 hover:opacity-95 transition shadow-md"
          >
            <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-white/70">Instagram</p>
              <p className="font-display text-xl font-semibold mt-0.5">@asb.tore</p>
              <p className="text-xs text-white/70 mt-0.5">Seguinos para inspiración</p>
            </div>
          </a>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-4 rounded-2xl bg-foreground text-background p-5 hover:opacity-95 transition"
          >
            <MessageCircle className="h-6 w-6 mt-0.5" />
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-background/60">WhatsApp</p>
              <p className="font-display text-xl mt-1">{phone}</p>
              <p className="text-xs text-background/70 mt-1">Respuesta en el día</p>
            </div>
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="flex items-start gap-4 rounded-2xl bg-card border border-border p-5 hover:shadow-soft transition"
          >
            <Phone className="h-6 w-6 mt-0.5" />
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Teléfono</p>
              <p className="font-display text-xl mt-1">{phone}</p>
            </div>
          </a>
          <div className="flex items-start gap-4 rounded-2xl bg-card border border-border p-5">
            <Clock className="h-6 w-6 mt-0.5" />
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Atención</p>
              <p className="text-sm mt-1">Lun a Sáb · 9:30 a 19:30</p>
              <p className="text-sm">Domingos · A coordinar</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl bg-card border border-border p-5">
            <MapPin className="h-6 w-6 mt-0.5" />
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Envíos</p>
              <p className="text-sm mt-1">Córdoba y zona en el día</p>
              <p className="text-sm">Interior del país: 48 a 72 hs</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
