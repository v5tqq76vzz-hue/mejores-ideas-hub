import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { whatsapp } from "@/lib/catalog";
import { FORMATS, FONTS, PALETTE, TEMPLATES, blank, renderToCanvas, uid, type Design, type El, type FormatKey } from "@/lib/editor";

type Props = { designId?: string };

export function DesignEditor({ designId }: Props) {
  const { session } = useAuth();
  const nav = useNavigate();
  const [d, setD] = useState<Design>(TEMPLATES[0].make());
  const [format, setFormat] = useState<FormatKey>("post");
  const [title, setTitle] = useState("Mi boceto");
  const [sel, setSel] = useState<string | null>(null);
  const [id, setId] = useState<string | undefined>(designId);
  const [msg, setMsg] = useState("");
  const [cat, setCat] = useState("Todas");
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    if (!designId) return;
    supabase.from("designs").select("*").eq("id", designId).maybeSingle().then(({ data }) => {
      if (data) { setD(data.data as unknown as Design); setTitle(data.title); setFormat(data.format as FormatKey); setId(data.id); }
    });
  }, [designId]);

  useEffect(() => {
    const fit = () => { const w = wrap.current?.clientWidth ?? 600; setScale(Math.min((w - 16) / d.w, 620 / d.h)); };
    fit(); window.addEventListener("resize", fit); return () => window.removeEventListener("resize", fit);
  }, [d.w, d.h]);

  const el = d.els.find((e) => e.id === sel);
  const upd = (p: Partial<El>) => setD((x) => ({ ...x, els: x.els.map((e) => (e.id === sel ? { ...e, ...p } : e)) }));
  const add = (type: El["type"]) => {
    const n: El = type === "text"
      ? { id: uid(), type, x: d.w * 0.1, y: d.h * 0.4, w: d.w * 0.8, h: 80, text: "Nuevo texto", size: Math.round(d.w / 16), color: "#0f172a", bold: true, font: "Montserrat", align: "center" }
      : { id: uid(), type, x: d.w * 0.35, y: d.h * 0.35, w: d.w * 0.3, h: d.w * 0.3, color: "#0067b8" };
    setD({ ...d, els: [...d.els, n] }); setSel(n.id);
  };
  const del = () => { setD({ ...d, els: d.els.filter((e) => e.id !== sel) }); setSel(null); };
  const layer = (dir: 1 | -1) => setD((x) => {
    const i = x.els.findIndex((e) => e.id === sel); const j = i + dir;
    if (i < 0 || j < 0 || j >= x.els.length) return x;
    const els = [...x.els]; [els[i], els[j]] = [els[j], els[i]]; return { ...x, els };
  });
  const pickFormat = (f: FormatKey) => {
    setFormat(f);
    if (f === "custom") return;
    const { w, h } = FORMATS[f];
    setD((x) => ({ ...x, w, h, els: x.els.map((e) => ({ ...e, x: (e.x / x.w) * w, y: (e.y / x.h) * h, w: (e.w / x.w) * w, h: (e.h / x.h) * h })) }));
  };

  const drag = (e: React.PointerEvent, item: El, mode: "move" | "resize") => {
    e.stopPropagation(); setSel(item.id);
    const sx = e.clientX, sy = e.clientY, o = { ...item };
    const mv = (ev: PointerEvent) => {
      const dx = (ev.clientX - sx) / scale, dy = (ev.clientY - sy) / scale;
      setD((x) => ({ ...x, els: x.els.map((q) => q.id !== item.id ? q : mode === "move"
        ? { ...q, x: o.x + dx, y: o.y + dy }
        : { ...q, w: Math.max(20, o.w + dx), h: Math.max(20, o.h + dy) }) }));
    };
    const up = () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = renderToCanvas(d).toDataURL("image/png"); a.download = `${title || "boceto"}.png`; a.click();
  };
  const save = async () => {
    if (!session) return;
    setMsg("Guardando…");
    const row = { title: title || "Mi boceto", format, data: d as never, user_id: session.user.id, updated_at: new Date().toISOString() };
    const res = id
      ? await supabase.from("designs").update(row).eq("id", id).select("id").single()
      : await supabase.from("designs").insert(row).select("id").single();
    if (res.error) return setMsg("No se pudo guardar: " + res.error.message);
    setId(res.data.id); setMsg("¡Guardado en tu cuenta!");
    if (!id) nav({ to: "/boceto", search: { id: res.data.id }, replace: true });
  };

  const cats = ["Todas", ...new Set(TEMPLATES.map((t) => t.cat))];
  const btn = "rounded-full border px-3 py-1.5 text-xs font-semibold hover:bg-muted";
  const inp = "w-full rounded-lg border bg-background px-3 py-2 text-sm";

  return (
    <div className="mx-auto grid max-w-7xl gap-5 px-4 pb-16 lg:grid-cols-[260px_1fr_260px]">
      {/* Plantillas */}
      <aside className="space-y-3 rounded-2xl border bg-card p-4 shadow-card lg:max-h-[760px] lg:overflow-auto">
        <h3 className="font-bold">Plantillas</h3>
        <div className="flex flex-wrap gap-1">
          {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`${btn} ${cat === c ? "bg-primary text-primary-foreground" : ""}`}>{c}</button>)}
        </div>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {TEMPLATES.filter((t) => cat === "Todas" || t.cat === cat).map((t) => (
            <button key={t.name} onClick={() => { setD(t.make()); setFormat(t.format); setSel(null); }} className="rounded-xl border p-2 text-left text-sm hover:border-primary">
              <span className="font-semibold">{t.name}</span>
              <span className="block text-xs text-muted-foreground">{t.cat} · {FORMATS[t.format].label}</span>
            </button>
          ))}
        </div>
        <h3 className="pt-2 font-bold">Medidas</h3>
        <select className={inp} value={format} onChange={(e) => pickFormat(e.target.value as FormatKey)}>
          {Object.entries(FORMATS).map(([k, f]) => <option key={k} value={k}>{f.label}</option>)}
          <option value="custom">Personalizada</option>
        </select>
        {format === "custom" && (
          <div className="flex gap-2">
            <input type="number" className={inp} value={d.w} min={200} max={4000} onChange={(e) => setD({ ...d, w: Math.min(4000, Math.max(200, +e.target.value)) })} aria-label="Ancho" />
            <input type="number" className={inp} value={d.h} min={200} max={4000} onChange={(e) => setD({ ...d, h: Math.min(4000, Math.max(200, +e.target.value)) })} aria-label="Alto" />
          </div>
        )}
        <button onClick={() => { setD(blank(d.w, d.h)); setSel(null); }} className={btn}>Lienzo en blanco</button>
      </aside>

      {/* Lienzo */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => add("text")} className={btn}>+ Texto</button>
          <button onClick={() => add("rect")} className={btn}>+ Rectángulo</button>
          <button onClick={() => add("circle")} className={btn}>+ Círculo</button>
          <span className="ml-auto text-xs text-muted-foreground">{Math.round(d.w)}×{Math.round(d.h)} px</span>
        </div>
        <div ref={wrap} className="grid min-h-[300px] place-items-center rounded-2xl border bg-muted p-2" onPointerDown={() => setSel(null)}>
          <div className="relative overflow-hidden shadow-elegant" style={{ width: d.w * scale, height: d.h * scale, background: d.bg }}>
            {d.els.map((e) => (
              <div key={e.id} onPointerDown={(ev) => drag(ev, e, "move")}
                className={`absolute cursor-move touch-none select-none ${sel === e.id ? "outline outline-2 outline-primary" : ""}`}
                style={{ left: e.x * scale, top: e.y * scale, width: e.w * scale, height: e.h * scale,
                  background: e.type === "text" ? "transparent" : e.color, borderRadius: e.type === "circle" ? "50%" : 0,
                  color: e.color, fontSize: (e.size ?? 48) * scale, fontFamily: e.font, fontWeight: e.bold ? 700 : 400,
                  textAlign: e.align, lineHeight: 1.2, whiteSpace: "pre-wrap" }}>
                {e.type === "text" && e.text}
                {sel === e.id && <span onPointerDown={(ev) => drag(ev, e, "resize")} className="absolute -bottom-1.5 -right-1.5 h-3 w-3 cursor-se-resize rounded-sm bg-primary" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Propiedades + guardar */}
      <aside className="space-y-3 rounded-2xl border bg-card p-4 shadow-card">
        <input className={inp} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} aria-label="Nombre del boceto" />
        <div className="text-sm font-semibold">{el ? "Elemento seleccionado" : "Fondo"}</div>
        <div className="flex flex-wrap gap-1.5">
          {PALETTE.map((c) => <button key={c} aria-label={c} onClick={() => (el ? upd({ color: c }) : setD({ ...d, bg: c }))} className="h-7 w-7 rounded-full border" style={{ background: c }} />)}
          <input type="color" aria-label="Color" value={el ? el.color : d.bg} onChange={(e) => (el ? upd({ color: e.target.value }) : setD({ ...d, bg: e.target.value }))} className="h-7 w-9" />
        </div>
        {el?.type === "text" && (
          <>
            <textarea className={inp} rows={2} value={el.text} onChange={(e) => upd({ text: e.target.value })} />
            <select className={inp} value={el.font} onChange={(e) => upd({ font: e.target.value })}>{FONTS.map((f) => <option key={f}>{f}</option>)}</select>
            <label className="block text-xs">Tamaño {el.size}
              <input type="range" min={12} max={300} value={el.size} onChange={(e) => upd({ size: +e.target.value, h: +e.target.value * 1.3 })} className="w-full" />
            </label>
            <div className="flex gap-1">
              <button onClick={() => upd({ bold: !el.bold })} className={btn}><b>B</b></button>
              {(["left", "center", "right"] as const).map((a) => <button key={a} onClick={() => upd({ align: a })} className={btn}>{a === "left" ? "Izq" : a === "center" ? "Centro" : "Der"}</button>)}
            </div>
          </>
        )}
        {el && (
          <div className="flex flex-wrap gap-1">
            <button onClick={() => layer(1)} className={btn}>Al frente</button>
            <button onClick={() => layer(-1)} className={btn}>Atrás</button>
            <button onClick={del} className={`${btn} text-destructive`}>Eliminar</button>
          </div>
        )}
        <hr />
        {session ? (
          <button onClick={save} className="w-full rounded-full bg-primary py-2.5 font-semibold text-primary-foreground">Guardar en mi cuenta</button>
        ) : (
          <Link to="/auth" search={{ redirect: "/boceto" }} className="block rounded-full bg-primary py-2.5 text-center font-semibold text-primary-foreground">Inicia sesión para guardar</Link>
        )}
        {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
        <button onClick={download} className="w-full rounded-full border py-2.5 font-semibold">Descargar PNG</button>
        <a href={whatsapp(`Hola DMD, hice un boceto en su editor: "${title}" (${Math.round(d.w)}×${Math.round(d.h)}). ¿Me ayudan a terminarlo?`)} target="_blank" rel="noreferrer"
          className="block rounded-full bg-success py-2.5 text-center font-semibold text-primary-foreground">Enviar a DMD por WhatsApp</a>
      </aside>
    </div>
  );
}
