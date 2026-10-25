import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { renderToCanvas, type Design } from "@/lib/editor";
import { Button } from "@/components/ui/button";

export const DESIGN_STATUSES = ["nuevo", "revisado", "en proceso", "terminado"];

function Thumb({ d }: { d: Design }) {
  const [src, setSrc] = useState("");
  useEffect(() => { try { setSrc(renderToCanvas(d, 240 / Math.max(d.w, d.h)).toDataURL()); } catch { /* invalid */ } }, [d]);
  return <div className="grid h-32 place-items-center bg-muted">{src && <img src={src} alt="" className="max-h-28 max-w-full shadow-card" />}</div>;
}

export function DesignList({ admin, userId }: { admin?: boolean; userId?: string | undefined }) {
  const qc = useQueryClient();
  const key = ["designs", admin ? "all" : userId];
  const [errorMessage, setErrorMessage] = useState("");
  const { data = [], isLoading, isError } = useQuery({
    queryKey: key,
    enabled: admin || !!userId,
    queryFn: async () => {
      let q = supabase.from("designs").select("*").order("updated_at", { ascending: false });
      if (!admin) {
        if (!userId) return [];
        q = q.eq("user_id", userId);
      }
      const { data, error } = await q;
      if (error) throw error;
      if (!admin || data.length === 0) return data.map((r) => ({ ...r, owner: "" }));
      const { data: profs } = await supabase.from("profiles").select("id, full_name, phone").in("id", [...new Set(data.map((r) => r.user_id))]);
      const m = new Map((profs ?? []).map((p) => [p.id, [p.full_name, p.phone].filter(Boolean).join(" · ")]));
      return data.map((r) => ({ ...r, owner: m.get(r.user_id) || "Cliente" }));
    },
  });
  const setStatus = async (id: string, status: string) => { const { error } = await supabase.from("designs").update({ status }).eq("id", id); if (error) { setErrorMessage("No se pudo cambiar el estado."); return; } qc.invalidateQueries({ queryKey: key }); };
  const remove = async (id: string) => { if (!confirm("¿Eliminar este boceto?")) return; const { error } = await supabase.from("designs").delete().eq("id", id); if (error) { setErrorMessage("No se pudo eliminar el diseño."); return; } qc.invalidateQueries({ queryKey: key }); };

  if (isLoading) return <p className="mt-4 text-muted-foreground">Cargando…</p>;
  if (isError) return <p role="alert" className="mt-4 text-destructive">No pudimos cargar tus diseños. Comprueba tu conexión e inténtalo nuevamente.</p>;
  if (data.length === 0) return (
    <div className="mt-4 rounded-2xl border bg-card p-8 text-center">
      <p className="text-muted-foreground">{admin ? "Aún no hay bocetos guardados." : "Aún no tienes bocetos."}</p>
      {!admin && <Link to="/boceto" className="mt-4 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Abrir el editor</Link>}
    </div>
  );
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {errorMessage && <p role="alert" className="col-span-full text-destructive">{errorMessage}</p>}
      {data.map((r) => (
        <div key={r.id} className="overflow-hidden rounded-lg border bg-card shadow-card">
          <Thumb d={r.data as unknown as Design} />
          <div className="space-y-2 p-4">
            <div className="truncate font-bold">{r.title}</div>
            <div className="truncate text-xs text-muted-foreground">{admin && `${r.owner} · `}{new Date(r.updated_at).toLocaleDateString("es-MX")}</div>
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/boceto" search={{ id: r.id }} className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Abrir</Link>
              {admin ? (
                <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="rounded-full border bg-background px-2 py-1 text-xs capitalize">
                  {DESIGN_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              ) : (
                <>
                  <span className="rounded-full bg-secondary px-2 py-1 text-xs capitalize">{r.status}</span>
                  <Button variant="ghost" size="sm" onClick={() => remove(r.id)} className="text-destructive">Eliminar</Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
