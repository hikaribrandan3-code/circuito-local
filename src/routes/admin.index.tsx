import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, LogOut, Pencil, Trash2, Plus, Download, Package, Link as LinkIcon } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  component: AdminDashboard,
});

type Item = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
};

type Profile = {
  id: string;
  phone: string | null;
  contact_info: string | null;
  shop_url: string | null;
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      if (!data.session) {
        navigate({ to: "/admin/login", replace: true });
        return;
      }
      setUserEmail(data.session.user.email ?? "");
      setUserId(data.session.user.id);
      await Promise.all([loadProfile(data.session.user.id), loadItems(data.session.user.id)]);
      setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function loadProfile(uid: string) {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
    setProfile(data ?? { id: uid, phone: "", contact_info: "", shop_url: "" });
  }

  async function loadItems(uid: string) {
    const { data } = await supabase.from("items").select("*").eq("user_id", uid).order("created_at", { ascending: false });
    setItems((data ?? []) as Item[]);
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      phone: profile.phone,
      contact_info: profile.contact_info,
      shop_url: profile.shop_url,
    });
    if (error) toast.error(error.message);
    else toast.success("Datos guardados");
  }

  async function saveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      user_id: userId,
      name: editing.name ?? "",
      description: editing.description ?? null,
      price: Number(editing.price) || 0,
      image_url: editing.image_url ?? null,
    };
    const op = editing.id
      ? supabase.from("items").update(payload).eq("id", editing.id)
      : supabase.from("items").insert(payload);
    const { error } = await op;
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Artículo actualizado" : "Artículo agregado");
    setEditing(null);
    loadItems(userId);
  }

  async function deleteItem(id: string) {
    if (!confirm("¿Eliminar este artículo?")) return;
    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Eliminado");
    loadItems(userId);
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  function downloadQR() {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "shop-qr.png";
    a.click();
  }

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const shopUrl = profile?.shop_url || (typeof window !== "undefined" ? window.location.origin : "");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Panel del Dueño</h1>
          <p className="text-sm text-muted-foreground">{userEmail}</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" /> Salir
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <Package className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Artículos</p>
              <p className="text-2xl font-semibold">{items.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <LinkIcon className="h-8 w-8 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Link de tu tienda</p>
              <a href={shopUrl} target="_blank" rel="noreferrer" className="block truncate text-sm font-medium hover:underline">
                {shopUrl}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Información de contacto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={profile?.phone ?? ""}
                onChange={(e) => setProfile({ ...(profile as Profile), phone: e.target.value })}
                placeholder="+54 9 11 ..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shop_url">URL del shop (para QR)</Label>
              <Input
                id="shop_url"
                value={profile?.shop_url ?? ""}
                onChange={(e) => setProfile({ ...(profile as Profile), shop_url: e.target.value })}
                placeholder={typeof window !== "undefined" ? window.location.origin : ""}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="contact_info">Info de contacto</Label>
              <Textarea
                id="contact_info"
                rows={3}
                value={profile?.contact_info ?? ""}
                onChange={(e) => setProfile({ ...(profile as Profile), contact_info: e.target.value })}
                placeholder="Dirección, horarios, redes, etc."
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Artículos</CardTitle>
          <Button size="sm" onClick={() => setEditing({ name: "", description: "", price: 0, image_url: "" })}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo
          </Button>
        </CardHeader>
        <CardContent>
          {editing && (
            <form onSubmit={saveItem} className="mb-6 grid gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input required value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Precio</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={editing.price ?? 0}
                  onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Imagen (URL)</Label>
                <Input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Descripción</Label>
                <Textarea rows={2} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit">{editing.id ? "Actualizar" : "Agregar"}</Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          {items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Aún no hay artículos. Agregá el primero.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="py-2 pr-4">Nombre</th>
                    <th className="py-2 pr-4">Precio</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} className="border-b last:border-0">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          {it.image_url && <img src={it.image_url} alt="" className="h-10 w-10 rounded object-cover" />}
                          <div>
                            <p className="font-medium">{it.name}</p>
                            {it.description && <p className="line-clamp-1 text-xs text-muted-foreground">{it.description}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 tabular-nums">${Number(it.price).toLocaleString("es-AR")}</td>
                      <td className="py-3 text-right">
                        <Button size="sm" variant="ghost" onClick={() => setEditing(it)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteItem(it.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Código QR de tu tienda</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div ref={qrRef} className="rounded-lg border border-border bg-white p-4">
            <QRCodeCanvas value={shopUrl} size={180} level="H" />
          </div>
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <p className="text-sm text-muted-foreground break-all">{shopUrl}</p>
            <Button onClick={downloadQR}>
              <Download className="mr-2 h-4 w-4" /> Descargar QR (PNG)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
