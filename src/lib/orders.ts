import { supabase } from "@/integrations/supabase/client";

export const STATUSES = ["pendiente", "anticipo pagado", "en proceso", "entregado", "cancelado"] as const;

export async function signOut() {
  await supabase.auth.signOut();
}

export type OrderItem = { id: string; name: string; price: number };
