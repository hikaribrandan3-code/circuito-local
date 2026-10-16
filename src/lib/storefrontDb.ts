import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";

// Frontend contract for the tables already used by the catalog and checkout.
// The generated baseline predates the checked-in inventory/CRM migrations.
type Table<Row> = { Row: Row; Insert: Partial<Row>; Update: Partial<Row>; Relationships: [] };
type Item = Database["public"]["Tables"]["items"]["Row"] & {
  category_id: string | null;
  has_sizes: boolean;
  sizes: Json;
  stock_quantity: number;
  stock_status: string;
};
type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  instagram_url: string | null;
  logo_url: string | null;
};
type StorefrontDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables"> & {
    Tables: {
      items: Table<Item>;
      profiles: Table<Profile>;
      categories: Table<{ id: string; user_id: string; name: string; display_order: number }>;
      item_images: Table<{ id: string; item_id: string; image_url: string; display_order: number }>;
      delivery_settings: Table<{ id: string; user_id: string; delivery_price: number }>;
      orders: Table<{
        id: string;
        user_id: string;
        customer_name: string;
        customer_phone: string;
        items: Json;
        total: number;
        delivery_method: string;
        customer_latitude: number | null;
        customer_longitude: number | null;
        status: string;
        created_at: string;
      }>;
      shop_customers: Table<{
        id: string;
        user_id: string;
        name: string;
        phone: string;
        created_at: string;
        updated_at: string;
      }>;
    };
  };
};
export const storefrontDb = supabase as unknown as SupabaseClient<StorefrontDatabase>;
