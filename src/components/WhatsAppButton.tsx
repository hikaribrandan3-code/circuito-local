import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5491100000000?text=Hola%20Circuito%2C%20tengo%20una%20consulta"
      target="_blank"
      rel="noreferrer"
      aria-label="Soporte por WhatsApp"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-[0_10px_40px_-10px_oklch(0.18_0.01_260/40%)] hover:scale-105 transition-transform"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={2.2} />
    </a>
  );
}
