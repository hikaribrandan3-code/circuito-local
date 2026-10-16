export type Category = string;
export const CATEGORIES = [
  { id: "hombre", label: "Hombre", description: "Prendas para todos los días" },
  { id: "mujer", label: "Mujer", description: "Tu estilo, tus reglas" },
  { id: "gorras", label: "Gorras", description: "El detalle que completa el look" },
  { id: "shorts", label: "Shorts", description: "Comodidad en movimiento" },
  { id: "accesorios", label: "Accesorios", description: "Detalles para tu look" },
  { id: "bolsos", label: "Bolsos", description: "Todo lo que llevás con vos" },
];
export type Product = {
  id: string;
  title: string;
  brand: string;
  category: Category;
  price: number;
  image: string;
  specs: string[];
  description: string;
  categoryName?: string;
  allImages?: string[];
  demo?: boolean;
  has_sizes?: boolean;
  sizes?: Record<string, boolean>;
  selectedSize?: string;
};
const demo = (
  id: string,
  title: string,
  category: string,
  price: number,
  photo: string,
): Product => ({
  id: `demo-${id}`,
  title,
  category,
  price,
  image: `/images/gallery/${photo}.webp`,
  brand: "R&E Urban Style",
  specs: ["Imagen real del local", "Precio ilustrativo para la demo"],
  description:
    "Una selección del local para descubrir el estilo R&E. El precio y la disponibilidad de esta prenda son ilustrativos en esta demo.",
  categoryName: CATEGORIES.find((c) => c.id === category)?.label,
  demo: true,
});
export const PRODUCTS: Product[] = [
  demo("remera-azul", "Remera gráfica azul", "hombre", 29900, "img_1446"),
  demo("remera-negra", "Remera gráfica negra", "hombre", 32900, "img_1447"),
  demo("gorra-jordan", "Gorra tejida camel", "gorras", 24900, "img_1448"),
  demo("gorra-game", "Gorra bordada negra", "gorras", 24900, "img_1453"),
  demo("prendas-mujer", "Selección de tops", "mujer", 27900, "img_1498"),
  demo("polo", "Remera combinada", "hombre", 35900, "img_1496"),
  demo("medias", "Medias urbanas", "accesorios", 8900, "img_1469"),
  demo("remera-blanca", "Remera con ribetes", "mujer", 29900, "img_1499"),
];
export const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
export const STORE = {
  name: "R&E Urban Style",
  tagline: "Ropa urbana · Córdoba",
  phone: "5435112276008",
  whatsapp: "5435112276008",
  instagram: "https://www.instagram.com/reachel_moda/",
  tiktok: "",
};
