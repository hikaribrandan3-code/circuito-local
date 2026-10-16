import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronRight,
  Instagram,
  LogOut,
  MessageCircle,
  Palette,
  Settings,
  Store,
  Camera,
  ImagePlus,
  Pencil,
} from "lucide-react";
export type StoreSetting = "whatsapp" | "business" | "appearance" | "instagram" | "account";
const actions = [
  {
    id: "whatsapp" as const,
    title: "Pedidos por WhatsApp",
    subtitle: "Número y mensaje",
    icon: MessageCircle,
  },
  {
    id: "business" as const,
    title: "Datos del negocio",
    subtitle: "Nombre, dirección y contacto",
    icon: Store,
  },
  {
    id: "appearance" as const,
    title: "Apariencia",
    subtitle: "Logo y estilo de la tienda",
    icon: Palette,
  },
  {
    id: "instagram" as const,
    title: "Instagram",
    subtitle: "Link y redes sociales",
    icon: Instagram,
  },
  {
    id: "account" as const,
    title: "Configuración",
    subtitle: "Cuenta y preferencias",
    icon: Settings,
  },
];
export function StoreManagement({
  onSelect,
  onLogout,
}: {
  onSelect: (setting: StoreSetting) => void;
  onLogout: () => void;
}) {
  return (
    <section className="rounded-3xl border border-black/5 bg-white p-4 sm:p-6">
      <h1 className="mb-5 text-xl font-semibold">Gestioná tu tienda</h1>
      <div className="store-management-grid grid gap-3 min-[360px]:grid-cols-2">
        <Link to="/" className="management-row">
          <ArrowUpRight size={22} />
          <span>
            <strong>Ver tienda</strong>
            <small>Abrí tu tienda online</small>
          </span>
          <ChevronRight size={18} />
        </Link>
        {actions.map(({ id, title, subtitle, icon: Icon }) => (
          <button key={id} type="button" onClick={() => onSelect(id)} className="management-row">
            <Icon size={22} />
            <span>
              <strong>{title}</strong>
              <small>{subtitle}</small>
            </span>
            <ChevronRight size={18} />
          </button>
        ))}
        <button type="button" onClick={onLogout} className="management-row min-[360px]:col-span-2">
          <LogOut size={22} />
          <span>
            <strong>Cerrar sesión</strong>
          </span>
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
export function AddProductActions({
  onCamera,
  onGallery,
  onManual,
}: {
  onCamera: () => void;
  onGallery: () => void;
  onManual: () => void;
}) {
  return (
    <section className="rounded-3xl border border-black/5 bg-white p-4 sm:p-6">
      <h2 className="text-lg font-semibold">Agregar producto</h2>
      <p className="mt-1 text-sm text-muted-foreground">¿Cómo querés empezar?</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { title: "Sacar foto", icon: Camera, action: onCamera },
          { title: "Elegir de galería", icon: ImagePlus, action: onGallery },
          { title: "Crear manualmente", icon: Pencil, action: onManual },
        ].map(({ title, icon: Icon, action }) => (
          <button
            type="button"
            key={title}
            onClick={action}
            className="flex min-h-20 items-center gap-3 rounded-2xl border border-black/10 p-4 text-left text-sm font-medium transition hover:bg-neutral-50"
          >
            <Icon size={22} className="shrink-0" />
            {title}
            <ChevronRight size={16} className="ml-auto shrink-0" />
          </button>
        ))}
      </div>
    </section>
  );
}
