import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Boxes, CircleDollarSign, Image as ImageIcon, Package, Plus, Upload } from "lucide-react";
import { AdminBottomNav, type AdminSection } from "@/components/AdminBottomNav";
import { OwnerHeader } from "@/components/OwnerHeader";
import {
  StoreManagement,
  AddProductActions,
  type StoreSetting,
} from "@/components/StoreManagement";
import { CATEGORIES, PRODUCTS, STORE, formatARS, type Product } from "@/lib/products";

const photos = [
  ["img_1445.webp", "Percheros con prendas"],
  ["img_1446.webp", "Remera gráfica azul"],
  ["img_1447.webp", "Gorras y accesorios"],
  ["img_1448.webp", "Selección de prendas"],
  ["img_1453.webp", "Detalles de la colección"],
  ["img_1455.webp", "Prendas en exhibición"],
  ["img_1456.webp", "Remera gráfica de espalda"],
  ["img_1469.webp", "Accesorios"],
  ["img_1472.webp", "Interior del local"],
  ["img_1474.webp", "Rincón de exhibición"],
  ["img_1488.webp", "Remera de la colección"],
  ["img_1489.webp", "Prendas en perchas"],
  ["img_1492.webp", "Detalle de una prenda"],
  ["img_1496.webp", "Selección del local"],
  ["img_1498.webp", "Tops de la colección"],
  ["img_1499.webp", "Remera con ribetes"],
  ["new-1456-web-back.webp", "Remera gráfica con estampa trasera"],
  ["new-1483-dark-denim.webp", "Jean baggy oscuro"],
  ["new-1489-rack-white-tee.webp", "Remera clara en exhibición"],
  ["new-1458-cross-tee.webp", "Remera negra con estampa urbana"],
  ["new-1459-cross-detail.webp", "Detalle de estampa urbana"],
  ["new-1457-grey-denim.webp", "Jean baggy gris"],
  ["ig-womens-butterfly-look.webp", "Look mujer con remera estampada"],
  ["ig-womens-white-butterfly.webp", "Remera blanca con mariposa"],
  ["ig-raglan-heart-tees.webp", "Remeras raglán estampadas"],
  ["ig-raglan-classic-tees.webp", "Remeras raglán clásicas"],
  ["ig-mens-black-look.webp", "Look urbano con remera negra"],
  ["ig-mens-white-tee-look.webp", "Look con remera blanca y bermuda"],
  ["ig-mens-grey-short-look.webp", "Look con remera gris y shorts"],
  ["ig-mens-grey-shorts-back.webp", "Bermuda baggy vista trasera"],
  ["ig-angel-print-tees.webp", "Remeras con estampa de alas"],
  ["ig-web-spider-tees.webp", "Remeras gráficas estampadas"],
  ["ig-graphic-shorts-set.webp", "Shorts baggy gráficos"],
  ["ig-tribal-shorts-set.webp", "Shorts con estampa tribal"],
  ["ig-dark-denim-shorts.webp", "Bermuda de jean oscura"],
  ["ig-white-graphic-hoodie.webp", "Buzo blanco estampado"],
] as const;

const stockById: Record<string, number> = {
  "demo-remera-azul": 8,
  "demo-remera-negra": 5,
  "demo-gorra-jordan": 12,
  "demo-gorra-game": 7,
  "demo-prendas-mujer": 6,
  "demo-polo": 4,
  "demo-medias": 15,
  "demo-remera-blanca": 9,
};

type Section = AdminSection;

export default function AdminDemo() {
  const [section, setSection] = useState<Section>("resumen");
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [stocks, setStocks] = useState(stockById);
  const photoInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [addStarted, setAddStarted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [setting, setSetting] = useState<StoreSetting | null>(null);
  const [draftPhoto, setDraftPhoto] = useState("");
  const [draftName, setDraftName] = useState("");
  const [draftCategory, setDraftCategory] = useState(CATEGORIES[0].id);
  const [draftPrice, setDraftPrice] = useState("");
  const [draftStock, setDraftStock] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const nav = [
    { id: "resumen", label: "Resumen" },
    { id: "productos", label: "Productos" },
    { id: "agregar", label: "Agregar" },
    { id: "tienda", label: "Tienda" },
  ];
  const goTo = (next: Section) => {
    setSection(next);
    setSetting(null);
    if (next === "agregar") {
      setAddStarted(false);
      setEditingId(null);
      setDraftPhoto("");
      setDraftName("");
      setDraftPrice("");
      setDraftStock("");
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const openCamera = () => {
    setAddStarted(true);
    photoInput.current?.click();
  };
  const openGallery = () => {
    setAddStarted(true);
    galleryInput.current?.click();
  };
  const editProduct = (product: Product) => {
    setEditingId(product.id);
    setDraftName(product.title);
    setDraftCategory(product.category);
    setDraftPrice(String(product.price));
    setDraftStock(String(stocks[product.id] ?? 0));
    setDraftPhoto(product.image.replace("/images/gallery/", ""));
    setAddStarted(true);
    setSection("agregar");
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const selectUploadedPhoto = (file?: File) => {
    if (!file) return;
    setDraftPhoto(URL.createObjectURL(file));
    setSavedMessage("");
  };
  const saveProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draftName.trim() || !draftPrice || !draftPhoto) return;
    const id = editingId ?? `demo-nuevo-${Date.now()}`;
    const categoryName = CATEGORIES.find((category) => category.id === draftCategory)?.label;
    const created: Product = {
      id,
      title: draftName.trim(),
      brand: "R&E Urban Style",
      category: draftCategory,
      categoryName,
      price: Number(draftPrice),
      image: draftPhoto.startsWith("blob:") ? draftPhoto : `/images/gallery/${draftPhoto}`,
      specs: ["Artículo agregado en la demo"],
      description: "Artículo de muestra agregado durante la demostración.",
      demo: true,
    };
    setProducts((current) =>
      editingId
        ? current.map((product) => (product.id === editingId ? created : product))
        : [created, ...current],
    );
    setStocks((current) => ({ ...current, [id]: Number(draftStock) || 0 }));
    setSection("productos");
    setSavedMessage(
      editingId ? "Artículo actualizado." : "Artículo agregado al inventario de muestra.",
    );
    setEditingId(null);
    setDraftName("");
    setDraftCategory(CATEGORIES[0].id);
    setDraftPrice("");
    setDraftStock("");
    setDraftPhoto("");
  };

  return (
    <div className="owner-shell min-h-screen text-[#171717]">
      <OwnerHeader demo />
      <input
        ref={photoInput}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          selectUploadedPhoto(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <input
        ref={galleryInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          selectUploadedPhoto(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 md:py-8">
        <main className="min-w-0">
          {section !== "tienda" && (
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
              <div>
                <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
                  {nav.find((item) => item.id === section)?.label}
                </h1>
                <p className="mt-1 text-xs text-black/50">
                  {section === "resumen" && "Resumen del inventario y la actividad."}
                  {section === "productos" && "Artículos, categorías, precios y stock."}
                  {section === "agregar" && "Cargá una prenda y elegí sus fotos."}
                </p>
              </div>
              <span className="rounded-full border border-amber-900/10 bg-amber-100/70 px-3 py-1.5 text-[10px] font-medium text-amber-950/75">
                DEMO · DATOS DE MUESTRA
              </span>
            </div>
          )}

          {section === "resumen" && (
            <>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <SummaryCard
                  icon={Package}
                  label="Productos"
                  value={String(products.length)}
                  note="en catálogo"
                  compact
                />
                <SummaryCard
                  icon={Boxes}
                  label="Unidades"
                  value={String(Object.values(stocks).reduce((a, b) => a + b, 0))}
                  note="stock de muestra"
                  compact
                />
                <SummaryCard
                  icon={CircleDollarSign}
                  label="Ventas"
                  value={formatARS(486500)}
                  note="monto ilustrativo"
                  compact
                />
              </div>
              <section className="mt-5 rounded-[1.5rem] border border-black/5 bg-white p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">Stock destacado</h2>
                    <p className="mt-1 text-xs text-black/50">
                      Un ejemplo de cómo se verían tus artículos.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSection("productos")}
                    className="min-h-11 shrink-0 text-xs underline underline-offset-4"
                  >
                    Ver productos
                  </button>
                </div>
                <ProductRows products={products} stocks={stocks} limit={4} onEdit={editProduct} />
              </section>
            </>
          )}

          {section === "productos" && (
            <section className="rounded-[1.5rem] border border-black/5 bg-white p-4 sm:p-5">
              {savedMessage && (
                <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  {savedMessage}
                </p>
              )}
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">Inventario</h2>
                  <p className="mt-1 text-xs text-black/50">
                    Categoría · artículo · precio · stock
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => goTo("agregar")}
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-black px-4 py-2.5 text-xs font-medium text-white"
                >
                  <Plus size={15} /> Agregar
                </button>
              </div>
              <ProductRows products={products} stocks={stocks} onEdit={editProduct} />
            </section>
          )}

          {section === "agregar" && !addStarted && (
            <AddProductActions
              onCamera={openCamera}
              onGallery={openGallery}
              onManual={() => setAddStarted(true)}
            />
          )}
          {section === "agregar" && addStarted && (
            <form
              onSubmit={saveProduct}
              className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.8fr)]"
            >
              <section className="rounded-[1.5rem] border border-black/5 bg-white p-4 sm:p-5">
                <h2 className="font-semibold">Datos del artículo</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-xs font-medium sm:col-span-2">
                    Nombre del artículo
                    <input
                      required
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      placeholder="Ej. Remera oversize gráfica"
                      className="rounded-xl border border-black/10 bg-[#faf9f7] px-3 py-3 text-sm font-normal outline-none focus:border-black/40"
                    />
                  </label>
                  <label className="grid gap-1.5 text-xs font-medium">
                    Categoría
                    <select
                      value={draftCategory}
                      onChange={(event) => setDraftCategory(event.target.value)}
                      className="rounded-xl border border-black/10 bg-[#faf9f7] px-3 py-3 text-sm font-normal"
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-xs font-medium">
                    Precio (ARS)
                    <input
                      required
                      min="0"
                      type="number"
                      value={draftPrice}
                      onChange={(event) => setDraftPrice(event.target.value)}
                      placeholder="29900"
                      className="rounded-xl border border-black/10 bg-[#faf9f7] px-3 py-3 text-sm font-normal"
                    />
                  </label>
                  <label className="grid gap-1.5 text-xs font-medium">
                    Unidades disponibles
                    <input
                      min="0"
                      type="number"
                      value={draftStock}
                      onChange={(event) => setDraftStock(event.target.value)}
                      placeholder="0"
                      className="rounded-xl border border-black/10 bg-[#faf9f7] px-3 py-3 text-sm font-normal"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={!draftName.trim() || !draftPrice || !draftPhoto}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto"
                >
                  <Plus size={17} /> Guardar artículo
                </button>
                {savedMessage && <p className="mt-3 text-xs text-emerald-700">{savedMessage}</p>}
              </section>
              <section className="rounded-[1.5rem] border border-black/5 bg-white p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">Fotos del artículo</h2>
                    <p className="mt-1 text-xs text-black/50">Elegí una foto o sacá una ahora.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => galleryInput.current?.click()}
                    className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-xs font-medium"
                  >
                    <Upload size={14} /> Subir
                  </button>
                </div>
                {draftPhoto && (
                  <img
                    src={
                      draftPhoto.startsWith("blob:") ? draftPhoto : `/images/gallery/${draftPhoto}`
                    }
                    alt="Vista previa del artículo"
                    className="mb-3 aspect-[4/3] w-full rounded-2xl bg-[#f7f6f3] object-cover"
                  />
                )}
                <div className="grid max-h-[330px] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
                  {photos.map(([src, title]) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => {
                        setDraftPhoto(src);
                        setSavedMessage("");
                      }}
                      aria-label={`Usar foto: ${title}`}
                      aria-pressed={draftPhoto === src}
                      className={`relative aspect-square overflow-hidden rounded-xl border-2 ${draftPhoto === src ? "border-black" : "border-transparent"}`}
                    >
                      <img
                        src={`/images/gallery/${src}`}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      {draftPhoto === src && (
                        <span className="absolute right-1 top-1 rounded-full bg-black p-1 text-white">
                          <ImageIcon size={12} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-right text-[10px] text-black/45">
                  {photos.length} fotos para elegir
                </p>
              </section>
            </form>
          )}

          {section === "tienda" && !setting && (
            <StoreManagement onSelect={setSetting} onLogout={() => navigate("/admin/login")} />
          )}
          {section === "tienda" && setting && (
            <section className="rounded-3xl border border-black/5 bg-white p-5">
              <button
                type="button"
                onClick={() => setSetting(null)}
                className="mb-5 min-h-11 text-xs underline"
              >
                ← Gestioná tu tienda
              </button>
              <h1 className="text-xl font-semibold">
                {
                  {
                    whatsapp: "Pedidos por WhatsApp",
                    business: "Datos del negocio",
                    appearance: "Apariencia",
                    instagram: "Instagram",
                    account: "Configuración",
                  }[setting]
                }
              </h1>
              <div className="mt-5 space-y-4 text-sm">
                {setting === "whatsapp" && <p>WhatsApp: +54 351 122 76008</p>}
                {setting === "business" && (
                  <>
                    <p>R&E Urban Style</p>
                    <p>Alta Lagurirre 2415 · Córdoba Capital</p>
                    <p>Lunes a sábado · 9:00 a 18:00</p>
                  </>
                )}
                {setting === "appearance" && (
                  <>
                    <img
                      src="/re-logo.svg"
                      alt="Logo de la tienda"
                      className="h-16 w-32 object-contain"
                    />
                    <p>Fondo crema · tipografía negra · acentos neutros</p>
                  </>
                )}
                {setting === "instagram" && (
                  <a
                    href={STORE.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center underline"
                  >
                    @reachel_moda ↗
                  </a>
                )}
                {setting === "account" && (
                  <p>Cuenta del propietario y preferencias de la tienda.</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Vista de muestra. Ingresá a tu cuenta para guardar cambios en tu tienda.
                </p>
                <Link
                  to="/admin/login"
                  className="inline-flex min-h-11 items-center rounded-full bg-black px-5 text-sm text-white"
                >
                  Ingresar
                </Link>
              </div>
            </section>
          )}
          <p className="mt-5 text-center text-[10px] leading-relaxed text-black/45 md:hidden">
            Demo · Los cambios se mantienen mientras esta página esté abierta.
          </p>
        </main>
      </div>
      <AdminBottomNav section={section} onChange={goTo} />
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  note,
  compact = false,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  note: string;
  compact?: boolean;
}) {
  return (
    <article
      className={`min-w-0 rounded-2xl border border-black/5 bg-white ${compact ? "p-3 sm:p-4" : "p-4"}`}
    >
      <div className="flex items-center justify-between text-black/45">
        <span className="truncate text-[10px] sm:text-xs">{label}</span>
        <Icon className="ml-1 shrink-0" size={15} />
      </div>
      <p
        className={`mt-2 truncate font-semibold tracking-tight ${compact ? "text-base sm:text-xl" : "text-xl"}`}
      >
        {value}
      </p>
      <p className="mt-1 truncate text-[9px] text-black/45 sm:text-[10px]">{note}</p>
    </article>
  );
}

function ProductRows({
  products,
  stocks,
  limit,
  onEdit,
}: {
  products: Product[];
  stocks: Record<string, number>;
  limit?: number;
  onEdit: (product: Product) => void;
}) {
  return (
    <div className="divide-y divide-black/5">
      {products.slice(0, limit).map((product) => {
        const stock = stocks[product.id] ?? 0;
        const category =
          CATEGORIES.find((item) => item.id === product.category)?.label ?? product.category;
        return (
          <button
            key={product.id}
            type="button"
            onClick={() => onEdit(product)}
            aria-label={`Editar ${product.title}`}
            className="flex w-full min-w-0 text-left items-center gap-3 py-3 first:pt-0 last:pb-0 sm:gap-4"
          >
            <img
              src={product.image}
              alt=""
              className="h-14 w-14 shrink-0 rounded-xl bg-black/5 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.title}</p>
              <p className="mt-1 truncate text-[11px] text-black/45">
                {category} · {formatARS(product.price)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold">
                {stock} <span className="text-[10px] font-normal text-black/45">u.</span>
              </p>
              <span className={`text-[10px] ${stock > 0 ? "text-emerald-700" : "text-black/45"}`}>
                {stock > 0 ? "Disponible" : "Sin stock"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
