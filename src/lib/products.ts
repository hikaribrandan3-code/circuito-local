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
  brand: string; // small label above title (e.g. "Hecho en Buenos Aires")
  category: Category;
  price: number; // ARS
  image: string;
  specs: string[];
  description: string;
};

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=80`;

export const PRODUCTS: Product[] = [
  {
    id: "ramo-peonias-blush",
    title: "Ramo de Peonías Blush",
    brand: "Floristería ABS",
    category: "flores",
    price: 38000,
    image: img("photo-1561181286-d3fee7d55364"),
    specs: ["12 peonías", "Eucalipto", "Papel kraft", "Envío en el día"],
    description:
      "Ramo artesanal de peonías rosadas con eucalipto fresco. Atado a mano y envuelto en papel kraft con cinta de lino.",
  },
  {
    id: "ramo-girasoles",
    title: "Girasoles del Campo",
    brand: "Floristería ABS",
    category: "flores",
    price: 22000,
    image: img("photo-1597848212624-a19eb35e2651"),
    specs: ["8 girasoles", "Frescos del día", "Envoltorio kraft"],
    description:
      "Girasoles luminosos seleccionados a mano. Ideales para alegrar cualquier ambiente.",
  },
  {
    id: "arreglo-jardin-secreto",
    title: "Arreglo Jardín Secreto",
    brand: "Floristería ABS",
    category: "flores",
    price: 52000,
    image: img("photo-1487530811176-3780de880c2d"),
    specs: ["Mix de estación", "Caja de madera", "Para regalo"],
    description:
      "Composición floral exuberante en caja de madera natural. Una experiencia visual y aromática.",
  },
  {
    id: "el-aleph-borges",
    title: "El Aleph — Jorge Luis Borges",
    brand: "Editorial Sudamericana",
    category: "libros",
    price: 18500,
    image: img("photo-1544947950-fa07a98d237f"),
    specs: ["Tapa dura", "232 págs.", "Edición conmemorativa"],
    description:
      "Una de las obras maestras de la literatura argentina. Edición conmemorativa con tipografía cuidada.",
  },
  {
    id: "rayuela-cortazar",
    title: "Rayuela — Julio Cortázar",
    brand: "Alfaguara",
    category: "libros",
    price: 21000,
    image: img("photo-1512820790803-83ca734da794"),
    specs: ["Tapa blanda", "736 págs.", "Edición 60 aniversario"],
    description:
      "La novela que cambió la forma de leer. Edición especial 60 aniversario con prólogo nuevo.",
  },
  {
    id: "martin-fierro",
    title: "Martín Fierro — José Hernández",
    brand: "Clásicos Argentinos",
    category: "libros",
    price: 14000,
    image: img("photo-1535905557558-afc4877a26fc"),
    specs: ["Tapa dura", "Ilustrado", "Bilingüe"],
    description:
      "El poema gauchesco argentino por excelencia. Edición ilustrada con notas al pie.",
  },
  {
    id: "mate-calabaza-alpaca",
    title: "Mate Calabaza con Virola de Alpaca",
    brand: "Artesanos del Norte",
    category: "mate",
    price: 32000,
    image: img("photo-1605118898735-43ddc3b8d40c"),
    specs: ["Calabaza natural", "Virola de alpaca", "Curado a mano"],
    description:
      "Mate tradicional de calabaza con virola y base de alpaca repujada. Listo para usar, curado por nuestros artesanos.",
  },
  {
    id: "set-mate-completo",
    title: "Set Mate Completo",
    brand: "ABS Mate Club",
    category: "mate",
    price: 64000,
    image: img("photo-1599054735388-bcb07bcd9c7c"),
    specs: ["Mate + bombilla", "Yerbera", "Termo Stanley", "Caja de regalo"],
    description:
      "Todo lo que necesitás para una buena ronda: mate de calabaza, bombilla de alpaca, yerbera y termo. En caja de madera lista para regalar.",
  },
  {
    id: "yerba-organica-misiones",
    title: "Yerba Orgánica de Misiones 500g",
    brand: "Cooperativa Yerbatera",
    category: "mate",
    price: 8500,
    image: img("photo-1576092768241-dec231879fc3"),
    specs: ["500g", "Orgánica certificada", "Sin palo"],
    description:
      "Yerba mate orgánica estacionada 24 meses. Sabor suave y aromático, sin agroquímicos.",
  },
  {
    id: "camiseta-seleccion-3-estrellas",
    title: "Camiseta Selección Argentina — 3 Estrellas",
    brand: "Argentina Oficial",
    category: "argentina",
    price: 145000,
    image: img("photo-1542652694-40abf526446e"),
    specs: ["Talles S a XXL", "Tela DryCool", "Edición campeón"],
    description:
      "Camiseta titular oficial de la Selección Argentina, edición tres estrellas. Para llevar la celeste y blanca con orgullo.",
  },
  {
    id: "bandera-argentina-bordada",
    title: "Bandera Argentina Bordada",
    brand: "Hecho en Argentina",
    category: "argentina",
    price: 28000,
    image: img("photo-1589271755523-7ee2b1b1cd11"),
    specs: ["90 x 150 cm", "Sol de Mayo bordado", "Tela premium"],
    description:
      "Bandera nacional con Sol de Mayo bordado a mano. Confeccionada en tela de alta resistencia.",
  },
  {
    id: "boina-vasca-tango",
    title: "Boina del Tango",
    brand: "San Telmo Crafts",
    category: "argentina",
    price: 22000,
    image: img("photo-1521369909029-2afed882baee"),
    specs: ["Lana 100%", "Talle único", "Hecha a mano"],
    description:
      "Boina clásica inspirada en el barrio de San Telmo. Tejida a mano en lana natural.",
  },
  {
    id: "caja-bienvenido-buenos-aires",
    title: "Caja Bienvenido a Buenos Aires",
    brand: "ABS Curated",
    category: "regalos",
    price: 78000,
    image: img("photo-1513885535751-8b9238bd345a"),
    specs: ["Alfajores", "Mate + yerba", "Libro de Borges", "Caja de madera"],
    description:
      "La introducción perfecta a la cultura argentina: alfajores artesanales, un mate, yerba premium y una edición de Borges. En caja de madera reutilizable.",
  },
  {
    id: "caja-tarde-de-mate",
    title: "Caja Tarde de Mate",
    brand: "ABS Curated",
    category: "regalos",
    price: 56000,
    image: img("photo-1556909114-44e3e9399a2d"),
    specs: ["Set de mate", "Yerba orgánica", "Bizcochitos", "Mantel"],
    description:
      "Todo lo necesario para una tarde inolvidable: mate completo, yerba orgánica, bizcochitos de grasa y un mantel de algodón.",
  },
  {
    id: "caja-romantica",
    title: "Caja Romántica",
    brand: "ABS Curated",
    category: "regalos",
    price: 92000,
    image: img("photo-1549007994-cb92caebd54b"),
    specs: ["Ramo de rosas", "Chocolates", "Vela aromática", "Tarjeta personalizada"],
    description:
      "Un gesto pensado al detalle: rosas frescas, bombones de chocolate semi-amargo, vela aromática y tarjeta escrita a mano.",
  },
];

export const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

export const STORE = {
  name: "ABS Store",
  tagline: "Regalos curados para personas con buen gusto",
  phone: "+54 9 3354 935 4752",
  whatsapp: "5493354935475", // digits only for wa.me
};
