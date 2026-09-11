import { FormEvent, useState } from "react";
import { StoreLoading, StoreShell, useCurrentStore } from "@/components/StoreShell";

export default function Contacto() {
  const { store, loading } = useCurrentStore();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  if (loading || !store) return <StoreLoading />;
  const send = (event: FormEvent) => {
    event.preventDefault();
    const phone = store.settings.whatsapp_number?.replace(/\D/g, "");
    if (phone)
      window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(`Hola ${store.name}, soy ${name}. ${message}`)}`,
        "_blank",
        "noopener",
      );
  };
  return (
    <StoreShell store={store}>
      <div className="mx-auto max-w-xl px-4 py-12">
        <span className="text-xs uppercase tracking-[.2em] text-muted-foreground">Contacto</span>
        <h1 className="font-display text-4xl mt-2">Hablemos</h1>
        <p className="mt-3 text-muted-foreground">
          {store.settings.city ? `${store.settings.city}. ` : ""}Consultanos y coordinamos por
          WhatsApp.
        </p>
        <form onSubmit={send} className="mt-8 space-y-4 rounded-3xl border bg-card p-6">
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Tu nombre"
            className="w-full rounded-xl border p-3"
          />
          <textarea
            required
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="¿En qué te ayudamos?"
            className="min-h-32 w-full rounded-xl border p-3"
          />
          <button className="w-full rounded-full bg-foreground py-3 text-background">
            Enviar por WhatsApp
          </button>
        </form>
        {store.settings.instagram_url && (
          <a
            className="mt-5 block text-sm underline"
            href={store.settings.instagram_url}
            target="_blank"
            rel="noreferrer"
          >
            Seguinos en Instagram
          </a>
        )}
      </div>
    </StoreShell>
  );
}
