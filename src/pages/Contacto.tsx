import { motion } from "framer-motion";
import { useState } from "react";
import { Phone, MessageCircle, Instagram, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { STORE } from "@/lib/products";

export default function Contacto() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hola ${STORE.name}, soy ${form.name} (${form.phone}).\n\n${form.message}`,
    );
    window.open(`https://wa.me/${STORE.whatsapp}?text=${text}`, "_blank");
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
          <a
            href={`https://wa.me/${STORE.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-4 rounded-2xl bg-foreground text-background p-5 hover:opacity-95 transition"
          >
            <MessageCircle className="h-6 w-6 mt-0.5" />
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-background/60">WhatsApp</p>
              <p className="font-display text-xl mt-1">{STORE.phone}</p>
              <p className="text-xs text-background/70 mt-1">Respuesta en el día</p>
            </div>
          </a>
          <a
            href={`tel:${STORE.phone.replace(/\s/g, "")}`}
            className="flex items-start gap-4 rounded-2xl bg-card border border-border p-5 hover:shadow-soft transition"
          >
            <Phone className="h-6 w-6 mt-0.5" />
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Teléfono</p>
              <p className="font-display text-xl mt-1">{STORE.phone}</p>
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
              <p className="text-sm mt-1">CABA y GBA en el día</p>
              <p className="text-sm">Interior del país: 48 a 72 hs</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl bg-card border border-border p-5">
            <Instagram className="h-6 w-6 mt-0.5" />
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Instagram</p>
              <p className="text-sm mt-1">@absstore</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
