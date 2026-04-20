import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingCart, Zap, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";
import { CATEGORIES } from "@/lib/products";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/catalogo", search: { q: q || undefined } as never });
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-strong border-b">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground">
            <Zap className="h-5 w-5 text-background" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Circuito
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sm">Categorías</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="glass-strong">
              {CATEGORIES.map((c) => (
                <DropdownMenuItem key={c.id} asChild>
                  <Link to="/catalogo" search={{ cat: c.id } as never}>{c.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" asChild><Link to="/catalogo">Catálogo</Link></Button>
          <Button variant="ghost" size="sm" asChild><Link to="/vender">Vender</Link></Button>
        </nav>

        <form onSubmit={submit} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar iPhone, teclado, cámara..."
              className="pl-9 bg-input/60 border-border"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 ml-auto">
          <Button asChild className="hidden sm:inline-flex bg-foreground text-background hover:bg-foreground/90 font-semibold rounded-full">
            <Link to="/vender">Vender</Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/carrito" aria-label="Carrito">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                  {count}
                </span>
              )}
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-strong">
              <DropdownMenuItem asChild><Link to="/catalogo">Catálogo</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/vender">Vender</Link></DropdownMenuItem>
              {CATEGORIES.map((c) => (
                <DropdownMenuItem key={c.id} asChild>
                  <Link to="/catalogo" search={{ cat: c.id } as never}>{c.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
