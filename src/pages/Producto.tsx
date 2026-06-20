import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ShoppingBag, Truck, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { formatARS, STORE } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type DbItem = { id: string; name: string; description: string | null; price: number; category_id: string; image_url: string | null };
type DbItemImage = { id: string; item_id: string; image_url: string; display_order: number };
type DbCategory = { id: string; name: string };

type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  categoryName: string;
  stock_status: string;
  description: string | null;
  allImages: string[];
};

export default function Producto() {
  const { id } = useParams<{ id: string }>();
  const { add } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        // Load the specific item
        const { data: itemData } = await supabase.from("items").select("*").eq("id", id).single();
        if (!itemData) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const item = itemData as DbItem;

        // Load all categories for lookups
        const { data: catsData } = await supabase.from("categories").select("*");
        const catMap: Record<string, string> = {};
        (catsData || []).forEach((c: DbCategory) => {
          catMap[c.id] = c.name;
        });

        // Load images for this item
        const { data: imagesData } = await supabase
          .from("item_images")
          .select("*")
          .eq("item_id", id)
          .order("display_order");

        const images = (imagesData || []).map((img: DbItemImage) => img.image_url);
        const firstImage = images[0] || item.image_url || "https://images.unsplash.com/photo-1549465120-7ccae1a7d4d6?auto=format&fit=crop&w=900&q=80";

        const prod: Product = {
          id: item.id,
          title: item.name,
          category: item.category_id,
          price: item.price,
          image: firstImage,
          categoryName: catMap[item.category_id] || "General",
          stock_status: "in_stock",
          description: item.description,
          allImages: images.length > 0 ? images : [firstImage],
        };

        setProduct(prod);

        // Load related products (same category)
        const { data: relatedData } = await supabase
          .from("items")
          .select("*")
          .eq("category_id", item.category_id)
          .neq("id", id)
          .limit(4);

        if (relatedData) {
          const { data: allImagesData } = await supabase.from("item_images").select("*").order("display_order");
          const imageMap: Record<string, DbItemImage[]> = {};
          (allImagesData || []).forEach((img: DbItemImage) => {
            if (!imageMap[img.item_id]) imageMap[img.item_id] = [];
            imageMap[img.item_id].push(img);
          });

          const relatedProducts: Product[] = relatedData.map((rel: DbItem) => ({
            id: rel.id,
            title: rel.name,
            category: rel.category_id,
            price: rel.price,
            image: imageMap[rel.id]?.[0]?.image_url || rel.image_url || "https://images.unsplash.com/photo-1549465120-7ccae1a7d4d6?auto=format&fit=crop&w=900&q=80",
            categoryName: catMap[rel.category_id] || "General",
            stock_status: "in_stock",
            description: rel.description,
            allImages: [],
          }));

          setRelated(relatedProducts);
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  const images = product?.allImages || [];

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-muted-foreground">Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Producto no encontrado</h1>
        <p className="mt-2 text-muted-foreground">Puede que ya no esté disponible.</p>
        <Button asChild className="mt-6 rounded-full"><Link to="/catalogo">Volver al catálogo</Link></Button>
      </div>
    );
  }

  const waText = encodeURIComponent(`Hola ${STORE.name}, me interesa el producto: ${product.title}`);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
      <Link to="/catalogo" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Volver al catálogo
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-elegant group"
        >
          <img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500"
          />

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 rounded-full bg-foreground/80 text-background text-sm px-3 py-1.5 font-medium">
              {currentImageIndex + 1}/{images.length}
            </div>
          )}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/60 hover:bg-background text-foreground p-2 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/60 hover:bg-background text-foreground p-2 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Foto siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Thumbnail dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`h-2 rounded-full transition-all ${i === currentImageIndex ? "bg-background w-6" : "bg-background/50 w-2"}`}
                  aria-label={`Ir a foto ${i + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{product.categoryName}</span>
          <h1 className="mt-2 font-display text-4xl md:text-5xl leading-tight">{product.title}</h1>
          <p className="mt-5 font-display text-3xl font-semibold">{formatARS(product.price)}</p>

          {product.description && (
            <p className="mt-6 text-foreground/80 leading-relaxed">{product.description}</p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => {
                add({
                  id: product.id,
                  title: product.title,
                  brand: product.categoryName,
                  category: product.category as any,
                  price: product.price,
                  image: product.image,
                  specs: [],
                  description: product.description || "",
                });
                toast.success("Añadido al carrito", { description: product.title });
              }}
              className="bg-foreground text-background hover:bg-foreground/90 font-medium rounded-full"
            >
              <ShoppingBag className="mr-1 h-4 w-4" /> Añadir al carrito
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href={`https://wa.me/${STORE.whatsapp}?text=${waText}`} target="_blank" rel="noreferrer">
                Consultar por WhatsApp
              </a>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-card border border-border p-4">
              <Heart className="h-5 w-5" />
              <p className="mt-2 text-sm font-medium">Empaque de regalo</p>
              <p className="text-xs text-muted-foreground">Incluido sin cargo</p>
            </div>
            <div className="rounded-xl bg-card border border-border p-4">
              <Truck className="h-5 w-5" />
              <p className="mt-2 text-sm font-medium">Envíos en el día</p>
              <p className="text-xs text-muted-foreground">Córdoba y zona</p>
            </div>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl md:text-4xl mb-6">También te puede gustar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
