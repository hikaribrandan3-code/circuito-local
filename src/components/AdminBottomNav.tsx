import { LayoutGrid, Package, Plus, Store } from "lucide-react";
import { NavigationDock } from "./NavigationDock";
export type AdminSection = "resumen" | "productos" | "agregar" | "tienda";
const ADMIN_DESTINATIONS = [
  { id: "resumen" as const, label: "Resumen", icon: LayoutGrid },
  { id: "productos" as const, label: "Productos", icon: Package },
  { id: "agregar" as const, label: "Agregar", icon: Plus },
  { id: "tienda" as const, label: "Tienda", icon: Store },
];
export function AdminBottomNav({
  section,
  onChange,
}: {
  section: AdminSection;
  onChange: (section: AdminSection) => void;
}) {
  return (
    <NavigationDock
      label="Navegación del panel"
      context="admin"
      items={ADMIN_DESTINATIONS.map((item) => ({
        ...item,
        active: section === item.id,
        onClick: () => onChange(item.id),
      }))}
    />
  );
}
