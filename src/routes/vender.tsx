import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/products";

export const Route = createFileRoute("/vender")({
  head: () => ({
    meta: [
      { title: "Vendenos tu equipo — Circuito" },
      {
        name: "description",
        content: "Cotizá tu iPhone, notebook, cámara o gaming en 1 minuto. Pago al instante y retiro gratis en CABA.",
      },
      { property: "og:title", content: "Vendenos tu equipo — Circuito" },
      { property: "og:description", content: "Cotización en minutos. Pago por transferencia o MercadoPago." },
    ],
  }),
  component: Sell,
});

const STEPS = ["Tipo", "Marca", "Modelo", "Condición", "Fotos", "Contacto"] as const;

function Sell() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    type: "",
    brand: "",
    model: "",
    condition: 8,
    photos: [] as string[],
    name: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const canContinue = () => {
    if (step === 0) return !!data.type;
    if (step === 1) return !!data.brand;
    if (step === 2) return !!data.model;
    if (step === 5) return !!data.name && !!data.phone;
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    toast.success("¡Cotización enviada!", { description: "Te contactamos por WhatsApp en menos de 1h." });
  };

  const onPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const urls = files.map((f) => URL.createObjectURL(f));
    setData((d) => ({ ...d, photos: [...d.photos, ...urls].slice(0, 5) }));
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 glow-cyan">
          <Check className="h-10 w-10 text-primary" strokeWidth={3} />
        </motion.div>
        <h1 className="mt-6 font-display text-3xl font-bold">¡Listo, {data.name}!</h1>
        <p className="mt-3 text-muted-foreground">
          Recibimos tu cotización para tu <strong>{data.brand} {data.model}</strong>.
          Te escribimos al <strong>{data.phone}</strong> en menos de 1 hora.
        </p>
        <Button asChild className="mt-8"><Link to="/catalogo">Ver el catálogo</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span className="text-muted-foreground">Cotización gratis en minutos</span>
        </span>
        <h1 className="mt-4 font-display text-3xl md:text-5xl font-bold leading-tight">
          Vendenos tu <span className="text-gradient">equipo.</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Contanos qué tenés y te pasamos una oferta clara, sin vueltas.
        </p>
      </motion.div>

      {/* Stepper */}
      <div className="mt-8 flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-gradient-to-r from-primary to-accent" : "bg-secondary"}`}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Paso {step + 1} de {STEPS.length} · {STEPS[step]}
      </p>

      <div className="mt-6 rounded-2xl glass-strong p-6 md:p-10 min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div>
                <h2 className="font-display text-2xl font-semibold">¿Qué tipo de equipo querés vender?</h2>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setData({ ...data, type: c.label })}
                      className={`rounded-xl border p-4 text-sm font-medium transition-all ${
                        data.type === c.label
                          ? "border-primary bg-primary/10 text-primary glow-cyan"
                          : "border-border glass hover:border-primary/40"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl font-semibold">¿De qué marca?</h2>
                <Input
                  className="mt-6"
                  placeholder="Apple, Sony, Razer..."
                  value={data.brand}
                  onChange={(e) => setData({ ...data, brand: e.target.value })}
                />
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl font-semibold">¿Qué modelo es?</h2>
                <Input
                  className="mt-6"
                  placeholder="iPhone 13 Pro Max, MacBook Air M2..."
                  value={data.model}
                  onChange={(e) => setData({ ...data, model: e.target.value })}
                />
              </div>
            )}
            {step === 3 && (
              <div>
                <h2 className="font-display text-2xl font-semibold">¿En qué condición está?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Elegí del 1 (muy usado) al 10 (como nuevo).
                </p>
                <div className="mt-8 text-center">
                  <span className="font-display text-7xl font-bold text-gradient">{data.condition}</span>
                  <span className="text-2xl text-muted-foreground">/10</span>
                </div>
                <Slider
                  className="mt-6"
                  min={1}
                  max={10}
                  step={1}
                  value={[data.condition]}
                  onValueChange={(v) => setData({ ...data, condition: v[0] })}
                />
              </div>
            )}
            {step === 4 && (
              <div>
                <h2 className="font-display text-2xl font-semibold">Subí fotos (opcional)</h2>
                <p className="mt-2 text-sm text-muted-foreground">Hasta 5 imágenes. Cuanto más mostrás, mejor cotización.</p>
                <label className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 p-10 cursor-pointer transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Arrastrá o hacé clic para subir</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={onPhotos} />
                </label>
                {data.photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {data.photos.map((src, i) => (
                      <img key={i} src={src} alt="" className="aspect-square rounded-lg object-cover" />
                    ))}
                  </div>
                )}
              </div>
            )}
            {step === 5 && (
              <div>
                <h2 className="font-display text-2xl font-semibold">¿Cómo te contactamos?</h2>
                <div className="mt-6 grid gap-4">
                  <div>
                    <Label>Tu nombre</Label>
                    <Input className="mt-2" placeholder="Juan Pérez" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>WhatsApp</Label>
                    <Input className="mt-2" placeholder="+54 9 11 0000-0000" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <Button variant="ghost" onClick={prev} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Atrás
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            onClick={next}
            disabled={!canContinue()}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 font-semibold"
          >
            Continuar <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canContinue()}
            className="bg-accent text-accent-foreground hover:opacity-90 font-semibold glow-yellow"
          >
            Solicitar Cotización
          </Button>
        )}
      </div>
    </div>
  );
}
