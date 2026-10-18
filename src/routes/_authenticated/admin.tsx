import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { mxn } from "@/lib/catalog";
import { STATUSES, type OrderItem } from "@/lib/orders";
import { DesignList } from "@/components/editor/DesignList";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel administrativo | DMD" },
      { name: "description", content: "Pedidos y pagos de Digital Majfa Dreams." },
      { property: "og:title", content: "Panel administrativo | DMD" },
      { property: "og:description", content: "Gestión de pedidos DMD." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { isAdmin, ready } = useAuth();
  const qc = useQueryClient();
  const { data: orders = [] } = useQuery({
    queryKey: ["all-orders"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (!ready) return <p className="p-12 text-center text-muted-foreground">Cargando…</p>;
  if (!isAdmin) return (
    <div className="p-12 text-center">
      <p className="text-muted-foreground">Esta sección es solo para administradores.</p>
      <Link to="/cuenta" className="mt-4 inline-block font-semibold text-primary">Ir a mi cuenta</Link>
    </div>
  );

  const paid = orders.filter((o) => o.status !== "pendiente" && o.status !== "cancelado");
  const kpis = [
    { k: mxn(paid.reduce((a, o) => a + o.total, 0)), v: "Vendido (confirmado)" },
    { k: String(orders.filter((o) => o.status === "pendiente").length), v: "Pedidos pendientes" },
    { k: String(orders.filter((o) => o.status === "en proceso").length), v: "En proceso" },
  ];
  const setStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["all-orders"] });
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">DMD Agency OS</span>
      <h1 className="mt-2 text-3xl font-bold">Panel de control</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.v} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="text-sm text-muted-foreground">{k.v}</div>
            <div className="mt-1 font-display text-3xl font-bold text-primary">{k.k}</div>
          </div>
        ))}
      </div>
      <h2 className="mt-10 text-xl font-bold">Pedidos</h2>
      <div className="mt-4 space-y-3">
        {orders.length === 0 && <p className="text-muted-foreground">Todavía no hay pedidos.</p>}
        {orders.map((o) => (
          <div key={o.id} className="grid gap-3 rounded-2xl border bg-card p-5 shadow-card md:grid-cols-[1fr_auto]">
            <div className="min-w-0">
              <div className="font-display font-bold">#DMD-{String(o.folio).padStart(4, "0")} · {o.customer_name}</div>
              <div className="text-sm text-muted-foreground">{o.phone}{o.email ? ` · ${o.email}` : ""} · {o.payment_method} · {new Date(o.created_at).toLocaleDateString("es-MX")}</div>
              <div className="mt-2 text-sm">{(o.items as OrderItem[]).map((i) => i.name).join(", ")}</div>
            </div>
            <div className="flex items-center gap-3 md:flex-col md:items-end">
              <div className="font-bold">{mxn(o.total)} <span className="text-xs font-normal text-muted-foreground">anticipo {mxn(o.deposit)}</span></div>
              <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} className="rounded-full border bg-background px-3 py-2 text-sm capitalize">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
      <h2 className="mt-10 text-xl font-bold">Bocetos de clientes</h2>
      <DesignList admin />
    </div>
  );
}
