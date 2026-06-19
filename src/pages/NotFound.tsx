import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-8xl text-muted-foreground">404</p>
      <h1 className="mt-4 font-display text-3xl">Página no encontrada</h1>
      <p className="mt-2 text-muted-foreground">El enlace que buscás no existe o fue movido.</p>
      <Button asChild className="mt-8 bg-foreground text-background hover:bg-foreground/90 rounded-full">
        <Link to="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
