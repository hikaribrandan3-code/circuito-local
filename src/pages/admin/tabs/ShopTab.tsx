import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, ChevronDown, ChevronUp } from "lucide-react";

type Category = { id: string; name: string; description: string | null; display_order: number };
type Item = { id: string; name: string; description: string | null; price: number; stock_status: string; category_id: string };
type ItemImage = { id: string; item_id: string; image_url: string; display_order: number };

type View = "categories" | "items";

export default function ShopTab({ userId }: { userId: string }) {
  const [view, setView] = useState<View>("items");
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [images, setImages] = useState<Record<string, ItemImage[]>>({});
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Category form
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);

  // Item form
  const [editingItem, setEditingItem] = useState<Partial<Item> | null>(null);
  const [itemImageUrls, setItemImageUrls] = useState<string[]>(["", "", ""]);

  useEffect(() => { loadCategories(); }, [userId]);
  useEffect(() => { loadItems(); }, [userId]);

  async function loadCategories() {
    const { data } = await supabase.from("categories").select("*").eq("user_id", userId).order("display_order");
    setCategories((data ?? []) as Category[]);
  }

  async function loadItems() {
    const { data } = await supabase.from("items").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setItems((data ?? []) as Item[]);
    if (data?.length) {
      const ids = data.map((i: Item) => i.id);
      const { data: imgs } = await supabase.from("item_images").select("*").in("item_id", ids).order("display_order");
      const map: Record<string, ItemImage[]> = {};
      (imgs ?? []).forEach((img: ItemImage) => {
        if (!map[img.item_id]) map[img.item_id] = [];
        map[img.item_id].push(img);
      });
      setImages(map);
    }
  }

  // --- CATEGORIES ---
  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCat) return;
    const payload = { user_id: userId, name: editingCat.name ?? "", description: editingCat.description ?? null, display_order: editingCat.display_order ?? 0 };
    const op = editingCat.id
      ? supabase.from("categories").update(payload).eq("id", editingCat.id)
      : supabase.from("categories").insert(payload);
    const { error } = await op;
    if (error) return toast.error(error.message);
    toast.success(editingCat.id ? "Categoría actualizada" : "Categoría creada");
    setEditingCat(null);
    loadCategories();
  }

  async function deleteCategory(id: string) {
    if (!confirm("¿Eliminar esta categoría y todos sus productos?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Eliminada");
    loadCategories();
    loadItems();
  }

  // --- ITEMS ---
  function openNewItem() {
    setEditingItem({ name: "", description: "", price: 0, stock_status: "in_stock", category_id: categories[0]?.id ?? "" });
    setItemImageUrls(["", "", ""]);
    setExpandedItem(null);
  }

  function openEditItem(item: Item) {
    setEditingItem(item);
    const imgs = images[item.id] ?? [];
    const urls = ["", "", ""].map((_, i) => imgs[i]?.image_url ?? "");
    setItemImageUrls(urls);
    setExpandedItem(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.category_id) return toast.error("Seleccioná una categoría");

    const payload = {
      user_id: userId,
      category_id: editingItem.category_id,
      name: editingItem.name ?? "",
      description: editingItem.description ?? null,
      price: Number(editingItem.price) || 0,
      stock_status: editingItem.stock_status ?? "in_stock",
    };

    let itemId = editingItem.id;

    if (itemId) {
      const { error } = await supabase.from("items").update(payload).eq("id", itemId);
      if (error) return toast.error(error.message);
      await supabase.from("item_images").delete().eq("item_id", itemId);
    } else {
      const { data, error } = await supabase.from("items").insert(payload).select().single();
      if (error || !data) return toast.error(error?.message ?? "Error");
      itemId = (data as Item).id;
    }

    const validUrls = itemImageUrls.filter(Boolean);
    if (validUrls.length) {
      await supabase.from("item_images").insert(
        validUrls.map((url, i) => ({ item_id: itemId, image_url: url, display_order: i }))
      );
    }

    toast.success(editingItem.id ? "Producto actualizado" : "Producto agregado");
    setEditingItem(null);
    loadItems();
  }

  async function deleteItem(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Eliminado");
    loadItems();
  }

  async function toggleStock(item: Item) {
    const next = item.stock_status === "in_stock" ? "out_of_stock" : "in_stock";
    const { error } = await supabase.from("items").update({ stock_status: next }).eq("id", item.id);
    if (error) return toast.error(error.message);
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, stock_status: next } : i));
  }

  const filteredItems = selectedCat === "all" ? items : items.filter((i) => i.category_id === selectedCat);
  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Shop</h1>
        <div className="flex gap-2">
          <Button size="sm" variant={view === "items" ? "default" : "outline"} onClick={() => setView("items")} className="rounded-full text-xs">
            Productos
          </Button>
          <Button size="sm" variant={view === "categories" ? "default" : "outline"} onClick={() => setView("categories")} className="rounded-full text-xs">
            Categorías
          </Button>
        </div>
      </div>

      {/* ── CATEGORIES VIEW ── */}
      {view === "categories" && (
        <div className="space-y-4">
          {editingCat ? (
            <form onSubmit={saveCategory} className="rounded-2xl bg-card border border-border p-5 shadow-soft space-y-3">
              <h2 className="font-display text-lg">{editingCat.id ? "Editar" : "Nueva"} categoría</h2>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input required value={editingCat.name ?? ""} onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })} className="rounded-full" />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input value={editingCat.description ?? ""} onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })} className="rounded-full" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="rounded-full bg-foreground text-background">Guardar</Button>
                <Button type="button" variant="ghost" onClick={() => setEditingCat(null)} className="rounded-full">Cancelar</Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setEditingCat({ name: "", description: "", display_order: categories.length })} className="rounded-full w-full bg-foreground text-background">
              <Plus className="h-4 w-4 mr-2" /> Nueva categoría
            </Button>
          )}

          <div className="space-y-2">
            {categories.length === 0 && (
              <div className="rounded-2xl bg-card border border-border p-8 text-center text-sm text-muted-foreground">
                Aún no hay categorías. Creá la primera.
              </div>
            )}
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between rounded-2xl bg-card border border-border p-4 shadow-soft">
                <div>
                  <p className="font-medium">{cat.name}</p>
                  {cat.description && <p className="text-xs text-muted-foreground">{cat.description}</p>}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditingCat(cat)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteCategory(cat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ITEMS VIEW ── */}
      {view === "items" && (
        <div className="space-y-4">
          {/* Item form */}
          {editingItem ? (
            <form onSubmit={saveItem} className="rounded-2xl bg-card border border-border p-5 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg">{editingItem.id ? "Editar" : "Nuevo"} producto</h2>
                <button type="button" onClick={() => setEditingItem(null)}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-2">
                  <Label>Nombre del producto</Label>
                  <Input required value={editingItem.name ?? ""} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className="rounded-full" />
                </div>
                <div className="space-y-2">
                  <Label>Precio (ARS)</Label>
                  <Input type="number" min="0" required value={editingItem.price ?? 0} onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })} className="rounded-full" />
                </div>
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <select
                    required
                    value={editingItem.category_id ?? ""}
                    onChange={(e) => setEditingItem({ ...editingItem, category_id: e.target.value })}
                    className="w-full h-10 rounded-full border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Elegir...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Descripción</Label>
                  <Textarea rows={3} value={editingItem.description ?? ""} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} className="rounded-2xl" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fotos (hasta 3 URLs)</Label>
                {itemImageUrls.map((url, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      value={url}
                      onChange={(e) => { const n = [...itemImageUrls]; n[i] = e.target.value; setItemImageUrls(n); }}
                      placeholder={`Foto ${i + 1} — URL de imagen`}
                      className="rounded-full text-sm"
                    />
                    {url && <img src={url} alt="" className="h-10 w-10 rounded-lg object-cover border border-border shrink-0" />}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 rounded-full bg-foreground text-background">Guardar producto</Button>
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)} className="rounded-full">Cancelar</Button>
              </div>
            </form>
          ) : (
            <Button onClick={openNewItem} className="rounded-full w-full bg-foreground text-background">
              <Plus className="h-4 w-4 mr-2" /> Nuevo producto
            </Button>
          )}

          {/* Category filter */}
          {categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              <button
                onClick={() => setSelectedCat("all")}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedCat === "all" ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                Todos ({items.length})
              </button>
              {categories.map((c) => {
                const count = items.filter((i) => i.category_id === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCat(c.id)}
                    className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedCat === c.id ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
                  >
                    {c.name} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Items list */}
          {filteredItems.length === 0 && !editingItem && (
            <div className="rounded-2xl bg-card border border-border p-8 text-center text-sm text-muted-foreground">
              {categories.length === 0 ? "Primero creá una categoría en la pestaña Categorías." : "No hay productos. Agregá el primero."}
            </div>
          )}

          <div className="space-y-2">
            {filteredItems.map((item) => {
              const itemImgs = images[item.id] ?? [];
              const isExpanded = expandedItem === item.id;
              const inStock = item.stock_status === "in_stock";
              return (
                <div key={item.id} className={`rounded-2xl bg-card border shadow-soft transition-all ${inStock ? "border-border" : "border-border/50 opacity-60"}`}>
                  <div className="flex items-center gap-3 p-3">
                    {itemImgs[0] ? (
                      <img src={itemImgs[0].image_url} alt={item.name} className="h-14 w-14 rounded-xl object-cover shrink-0 border border-border" />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-secondary shrink-0 flex items-center justify-center text-xs text-muted-foreground">Sin foto</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{catName(item.category_id)}</p>
                      <p className="font-display text-base font-semibold mt-0.5">${item.price.toLocaleString("es-AR")}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditItem(item)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => deleteItem(item.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setExpandedItem(isExpanded ? null : item.id)}>
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                      <button onClick={() => toggleStock(item)} className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-colors ${inStock ? "border-success/40 text-success bg-success/5" : "border-muted text-muted-foreground bg-muted/30"}`}>
                        {inStock ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                        {inStock ? "En stock" : "Sin stock"}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border px-4 py-3 space-y-2">
                      {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                      {itemImgs.length > 1 && (
                        <div className="flex gap-2">
                          {itemImgs.map((img) => (
                            <img key={img.id} src={img.image_url} alt="" className="h-16 w-16 rounded-lg object-cover border border-border" />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
