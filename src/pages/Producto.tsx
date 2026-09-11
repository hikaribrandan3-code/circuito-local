import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  getProduct,
  mediaUrl,
  productImage,
  variantLabel,
  type Product,
  type Variant,
} from "@/lib/commerce";
import { useCart } from "@/lib/cart";
import {
  StoreLoading,
  StoreShell,
  StoreUnavailable,
  useCurrentStore,
} from "@/components/StoreShell";

export default function Producto() {
  const { store, loading, error } = useCurrentStore();
  const { productSlug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [resolved, setResolved] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const { add } = useCart();
  useEffect(() => {
    if (!store || !productSlug) return;
    setResolved(false);
    setProduct(null);
    getProduct(store, productSlug)
      .then(setProduct)
      .finally(() => setResolved(true));
  }, [store, productSlug]);
  const selectedVariant = useMemo<Variant | undefined>(
    () =>
      product?.variants.find(
        (variant) =>
          variant.option_value_ids.length === selectedValues.length &&
          variant.option_value_ids.every((id) => selectedValues.includes(id)),
      ),
    [product, selectedValues],
  );
  if (loading) return <StoreLoading message="Cargando producto…" />;
  if (!store) return <StoreUnavailable message={error || undefined} />;
  if (!resolved) return <StoreLoading message="Cargando producto…" />;
  if (!product) {
    return (
      <StoreShell store={store}>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl">Producto no encontrado</h1>
          <Link className="mt-5 inline-block underline" to={`/${store.slug}/catalogo`}>
            Volver al catálogo
          </Link>
        </div>
      </StoreShell>
    );
  }
  const needsVariant = product.options.length > 0;
  const price = selectedVariant?.price ?? product.price;
  const choose = (optionId: string, valueId: string) =>
    setSelectedValues((previous) => [
      ...previous.filter(
        (id) =>
          !product.options
            .find((option) => option.id === optionId)
            ?.values.some((value) => value.id === id),
      ),
      valueId,
    ]);
  const isSelectable = (optionId: string, valueId: string) => {
    const selectedElsewhere = selectedValues.filter(
      (selectedId) =>
        !product.options
          .find((option) => option.id === optionId)
          ?.values.some((value) => value.id === selectedId),
    );
    return product.variants.some(
      (variant) =>
        variant.availability === "available" &&
        variant.option_value_ids.includes(valueId) &&
        selectedElsewhere.every((selectedId) => variant.option_value_ids.includes(selectedId)),
    );
  };
  const canAdd =
    product.availability === "available" &&
    (!needsVariant || Boolean(selectedVariant && selectedVariant.availability === "available"));
  return (
    <StoreShell store={store}>
      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-8">
        <Link to={`/${store.slug}/catalogo`} className="text-sm text-muted-foreground">
          ← Volver al catálogo
        </Link>
        <div className="mt-6 grid lg:grid-cols-2 gap-8 lg:gap-14">
          <div className="grid gap-3">
            {product.images.length ? (
              product.images.map((image, index) => (
                <img
                  key={image.id}
                  src={mediaUrl(image.storage_path, index ? 800 : 1400)}
                  alt={image.alt_text || product.name}
                  loading={index ? "lazy" : "eager"}
                  decoding="async"
                  width="1400"
                  height="1750"
                  className="w-full rounded-3xl aspect-[4/5] object-cover"
                />
              ))
            ) : (
              <img
                src={productImage(product, 1400)}
                alt={product.name}
                width="1400"
                height="1750"
                className="w-full rounded-3xl aspect-[4/5] object-cover"
              />
            )}
          </div>
          <div className="lg:sticky lg:top-24 h-fit">
            <p className="text-sm text-muted-foreground">{product.category?.name}</p>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">{product.name}</h1>
            <p className="mt-4 font-display text-3xl">${price.toLocaleString("es-AR")}</p>
            {product.description && (
              <p className="mt-6 leading-relaxed text-foreground/80 whitespace-pre-line">
                {product.description}
              </p>
            )}
            <div className="mt-8 space-y-5">
              {product.options.map((option) => (
                <fieldset key={option.id}>
                  <legend className="text-sm font-medium mb-2">{option.name}</legend>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const chosen = selectedValues.includes(value.id);
                      const possible = isSelectable(option.id, value.id);
                      return (
                        <button
                          type="button"
                          disabled={!possible}
                          key={value.id}
                          onClick={() => choose(option.id, value.id)}
                          className={`rounded-full border px-4 py-2 text-sm ${chosen ? "bg-foreground text-background" : "bg-background"} disabled:opacity-35`}
                        >
                          {value.value}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
            {selectedVariant && (
              <p className="mt-4 text-sm text-muted-foreground">
                {variantLabel(product, selectedVariant)}
              </p>
            )}
            <button
              disabled={!canAdd}
              onClick={() => {
                if (needsVariant && !selectedVariant)
                  return toast.error("Elegí las opciones del producto");
                add(product, selectedVariant ?? null);
                toast.success("Agregado al carrito");
              }}
              className="mt-8 w-full rounded-full bg-foreground px-5 py-3 font-medium text-background disabled:opacity-40"
            >
              {product.availability === "sold_out" ? "Agotado" : "Agregar al carrito"}
            </button>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
