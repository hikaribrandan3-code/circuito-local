import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";
import { useStoreProducts } from "@/lib/useStoreProducts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { categories } = useStoreProducts();
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-strong border-b">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <Link to="/" aria-label="R&E Urban Style · Inicio" className="shrink-0">
          <img
            src="/re-logo.svg"
            alt="R&E Urban Style"
            className="h-10 w-28 object-contain object-left sm:h-11"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sm">
                Categorías
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="glass-strong">
              {categories.map((c) => (
                <DropdownMenuItem key={c.id} asChild>
                  <Link to={`/catalogo?cat=${c.id}`}>{c.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/catalogo">Catálogo</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/contacto">Contacto</Link>
          </Button>
        </nav>

        <form onSubmit={submit} className="hidden md:flex flex-1 max-w-sm ml-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar prendas..."
              className="pl-9 bg-input/60 border-border rounded-full"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            asChild
            className="hidden sm:inline-flex bg-foreground text-background hover:bg-foreground/90 font-medium rounded-full"
          >
            <Link to="/catalogo">Ver colección</Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative h-11 w-11">
            <Link to="/carrito" aria-label="Carrito">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                  {count}
                </span>
              )}
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Abrir menú" className="h-11 w-11">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-strong">
              <DropdownMenuItem asChild>
                <Link to="/catalogo">Catálogo</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/contacto">Contacto</Link>
              </DropdownMenuItem>
              {categories.map((c) => (
                <DropdownMenuItem key={c.id} asChild>
                  <Link to={`/catalogo?cat=${c.id}`}>{c.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
