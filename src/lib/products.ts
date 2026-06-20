export type Category = "flores" | "libros" | "mate" | "argentina" | "regalos";

export const CATEGORIES: { id: Category; label: string; description: string }[] = [
  { id: "flores", label: "Flores", description: "Ramos frescos y arreglos artesanales" },
  { id: "libros", label: "Libros", description: "Selección curada de autores argentinos y clásicos" },
  { id: "mate", label: "Mate & Accesorios", description: "Mates, bombillas, yerberas y yerba premium" },
  { id: "argentina", label: "Argentina", description: "Camisetas, banderas y piezas culturales" },
  { id: "regalos", label: "Regalos Especiales", description: "Cajas curadas para cada ocasión" },
];

export type Product = {
  id: string;
  title: string;
  brand: string; // small label above title (e.g. "Hecho en Córdoba Capital")
  category: Category;
  price: number; // ARS
  image: string;
  specs: string[];
  description: string;
};

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=80`;

// Coming Soon - Add your products here! 🚀
// Products will be displayed in each category when added
export const PRODUCTS: Product[] = [];

export const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

export const STORE = {
  name: "ASB Store",
  tagline: "Boutique de regalos · Córdoba Capital",
  phone: "+54 9 3354 935 4752",
  whatsapp: "5493354935475", // digits only for wa.me
  instagram: "@asbstore",
};
