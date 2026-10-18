import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { mxn } from "@/lib/catalog";
import type { OrderItem } from "@/lib/orders";
import { DesignList } from "@/components/editor/DesignList";

export const Route = createFileRoute("/_authenticated/cuenta")({
  head: () => ({
    meta: [
      { title: "Mi cuenta | DMD" },
      { name: "description", content: "Tus pedidos con Digital Majfa Dreams." },
      { property: "og:title", content: "Mi cuenta | DMD" },
      { property: "og:description", content: "Portal de clientes DMD." },
    ],
  }),
  component: Cuenta,
});

function Cuenta() {
  const { session, isAdmin } = useAuth();
  const qc = useQueryClient();
  const nav = useNavigate();
  const uid = session?.user.id;
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").eq("user_id", uid!).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const out = async () => { await qc.cancelQueries(); qc.clear(); await supabase.auth.signOut(); nav({ to: "/auth", replace: true }); };

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-bold">Mi cuenta</h1>
          <p className="truncate text-sm text-muted-foreground">{session?.user.email}</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && <Link to="/admin" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-ink-foreground">Panel admin</Link>}
          <button onClick={out} className="rounded-full border px-4 py-2 text-sm font-semibold">Salir</button>
        </div>
      </div>
      <h2 className="mt-10 text-xl font-bold">Mis pedidos</h2>
      {isLoading ? <p className="mt-4 text-muted-foreground">Cargando…</p> : orders.length === 0 ? (
        <div className="mt-4 rounded-2xl border bg-card p-8 text-center">
          <p className="text-muted-foreground">Aún no tienes pedidos.</p>
          <Link to="/servicios" className="mt-4 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Cotizar ahora</Link>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <span className="font-display font-bold">#DMD-{String(o.folio).padStart(4, "0")}</span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold capitalize text-secondary-foreground">{o.status}</span>
              </div>
              <ul className="mt-3 text-sm text-muted-foreground">
                {(o.items as OrderItem[]).map((i) => <li key={i.id}>• {i.name}</li>)}
              </ul>
              <div className="mt-3 flex justify-between text-sm"><span>{new Date(o.created_at).toLocaleDateString("es-MX")}</span><span className="font-bold">{mxn(o.total)}</span></div>
            </div>
          ))}
        </div>
      )}
      <h2 className="mt-10 text-xl font-bold">Mis bocetos</h2>
      <DesignList userId={uid} />
    </div>
  );
}
