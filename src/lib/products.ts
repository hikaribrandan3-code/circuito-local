export type Condition = "Como Nuevo" | "Excelente" | "Muy Bueno" | "Buen Estado";

export type Category = "apple" | "pc-gamer" | "fotografia" | "accesorios";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "apple", label: "Apple" },
  { id: "pc-gamer", label: "PC Gamer" },
  { id: "fotografia", label: "Fotografía" },
  { id: "accesorios", label: "Accesorios" },
];

export type Product = {
  id: string;
  title: string;
  brand: string;
  category: Category;
  price: number; // ARS
  conditionScore: number; // 1-10
  conditionLabel: Condition;
  image: string;
  specs: string[];
  description: string;
};

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=800&q=80`;

export const PRODUCTS: Product[] = [
  {
    id: "iphone-13-pro-max-256",
    title: "iPhone 13 Pro Max 256GB",
    brand: "Apple",
    category: "apple",
    price: 900000,
    conditionScore: 9,
    conditionLabel: "Como Nuevo",
    image: img("photo-1632661674596-df8be070a5c5"),
    specs: ["256GB", "Sierra Blue", "Batería 92%", "Liberado"],
    description:
      "iPhone 13 Pro Max impecable, con todos sus accesorios originales. Batería al 92% y sin marcas de uso.",
  },
  {
    id: "hyperx-cloud-flight",
    title: "Auriculares HyperX Cloud Flight",
    brand: "HyperX",
    category: "pc-gamer",
    price: 85000,
    conditionScore: 8,
    conditionLabel: "Excelente",
    image: img("photo-1599669454699-248893623440"),
    specs: ["Wireless 2.4GHz", "30h batería", "Drivers 50mm", "PC / PS"],
    description:
      "Auriculares gamer inalámbricos con sonido envolvente y autonomía de 30 horas. Almohadillas como nuevas.",
  },
  {
    id: "keychron-k2",
    title: "Teclado Mecánico Keychron K2",
    brand: "Keychron",
    category: "accesorios",
    price: 120000,
    conditionScore: 10,
    conditionLabel: "Como Nuevo",
    image: img("photo-1587829741301-dc798b83add3"),
    specs: ["75% layout", "Switch Brown", "RGB", "Bluetooth 5.1"],
    description:
      "Teclado mecánico premium, prácticamente sin uso. Ideal para trabajo y gaming.",
  },
  {
    id: "macbook-air-m2",
    title: "MacBook Air M2 13\" 8/256",
    brand: "Apple",
    category: "apple",
    price: 1450000,
    conditionScore: 9,
    conditionLabel: "Como Nuevo",
    image: img("photo-1517336714731-489689fd1ca8"),
    specs: ["Chip M2", "8GB RAM", "256GB SSD", "Midnight"],
    description:
      "MacBook Air M2 con cargador original y caja. Ciclos de batería bajos y rendimiento impecable.",
  },
  {
    id: "razer-deathadder-v3",
    title: "Mouse Razer DeathAdder V3 Pro",
    brand: "Razer",
    category: "pc-gamer",
    price: 95000,
    conditionScore: 9,
    conditionLabel: "Excelente",
    image: img("photo-1527814050087-3793815479db"),
    specs: ["Wireless", "30K DPI", "63g", "90h batería"],
    description:
      "Mouse profesional ultraliviano para esports. Switches ópticos sin uso intensivo.",
  },
  {
    id: "sony-a7iii",
    title: "Sony Alpha A7 III + 28-70mm",
    brand: "Sony",
    category: "fotografia",
    price: 2200000,
    conditionScore: 8,
    conditionLabel: "Muy Bueno",
    image: img("photo-1502920917128-1aa500764cbd"),
    specs: ["Full Frame 24MP", "4K Video", "Lente kit", "12k disparos"],
    description:
      "Cámara mirrorless full frame con lente 28-70mm. Ideal para foto y video profesional.",
  },
  {
    id: "logitech-mx-master-3s",
    title: "Logitech MX Master 3S",
    brand: "Logitech",
    category: "accesorios",
    price: 110000,
    conditionScore: 10,
    conditionLabel: "Como Nuevo",
    image: img("photo-1615663245857-ac93bb7c39e7"),
    specs: ["8K DPI", "Silencioso", "USB-C", "Multi-device"],
    description:
      "El mouse productivo definitivo. Como nuevo, con caja original.",
  },
  {
    id: "ipad-air-5",
    title: "iPad Air 5ª Gen 64GB Wi-Fi",
    brand: "Apple",
    category: "apple",
    price: 780000,
    conditionScore: 9,
    conditionLabel: "Como Nuevo",
    image: img("photo-1561154464-82e9adf32764"),
    specs: ["Chip M1", "10.9\"", "64GB", "Space Gray"],
    description:
      "iPad Air con chip M1, perfecto para creativos. Sin marcas y con accesorios originales.",
  },
  {
    id: "nikon-z6",
    title: "Nikon Z6 Cuerpo + adaptador FTZ",
    brand: "Nikon",
    category: "fotografia",
    price: 1850000,
    conditionScore: 8,
    conditionLabel: "Muy Bueno",
    image: img("photo-1606983340126-99ab4feaa64a"),
    specs: ["Full Frame 24MP", "4K UHD", "Adaptador FTZ", "20k disparos"],
    description:
      "Mirrorless Nikon Z6 con adaptador para usar lentes F. Excelente estado.",
  },
  {
    id: "airpods-pro-2",
    title: "AirPods Pro 2ª Generación",
    brand: "Apple",
    category: "apple",
    price: 320000,
    conditionScore: 9,
    conditionLabel: "Como Nuevo",
    image: img("photo-1600294037681-c80b4cb5b434"),
    specs: ["ANC", "USB-C", "MagSafe", "Spatial Audio"],
    description:
      "AirPods Pro 2 con cancelación activa y estuche MagSafe. Casi sin uso.",
  },
  {
    id: "rtx-3070",
    title: "Placa de Video RTX 3070 Founders",
    brand: "Nvidia",
    category: "pc-gamer",
    price: 650000,
    conditionScore: 8,
    conditionLabel: "Muy Bueno",
    image: img("photo-1591488320449-011701bb6704"),
    specs: ["8GB GDDR6", "Ray Tracing", "DLSS", "Sin minería"],
    description:
      "RTX 3070 testeada, sin uso de minería. Listo para 1440p ultra.",
  },
  {
    id: "gopro-hero-11",
    title: "GoPro HERO11 Black",
    brand: "GoPro",
    category: "fotografia",
    price: 480000,
    conditionScore: 9,
    conditionLabel: "Excelente",
    image: img("photo-1526317899216-43be5af6839d"),
    specs: ["5.3K60", "HyperSmooth 5.0", "Sumergible 10m", "2 baterías"],
    description:
      "Action cam con accesorios extra. Ideal para deportes y viajes.",
  },
];

export const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
