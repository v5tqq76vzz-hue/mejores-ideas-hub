import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Type, Square, Circle, Copy, Trash2, ZoomIn, ZoomOut, Maximize, Download, Save, Bold, AlignLeft, AlignCenter, AlignRight, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { whatsapp } from "@/lib/catalog";
import { FORMATS, FONTS, PALETTE, TEMPLATES, blank, renderToCanvas, uid, duplicateElement, type Design, type El, type FormatKey } from "@/lib/editor";
import { STUDIO_TEMPLATES } from "@/lib/studio";
import { downloadBlob } from "@/lib/download";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ALL_TEMPLATES = [...STUDIO_TEMPLATES, ...TEMPLATES];
type Props = { designId?: string | undefined; templateName?: string | undefined; blankFormat?: FormatKey | undefined };
function Tool({ label, children, onClick, disabled }: { label: string; children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" aria-label={label} disabled={disabled} onClick={onClick}>{children}</Button></TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>;
}
function initialDesign(templateName?: string, blankFormat?: FormatKey) {
  if (blankFormat && blankFormat !== "custom") { const f = FORMATS[blankFormat]; return blank(f.w, f.h); }
  return ALL_TEMPLATES.find((t) => t.name === templateName)?.make() ?? TEMPLATES[0]?.make() ?? blank(1080, 1080);
}
function isDesign(value: unknown): value is Design {
  if (!value || typeof value !== "object") return false;
  const d = value as Design;
  return Number.isFinite(d.w) && d.w > 0 && Number.isFinite(d.h) && d.h > 0 && typeof d.bg === "string" && Array.isArray(d.els);
}

export function DesignEditor({ designId, templateName, blankFormat }: Props) {
  const { session } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();
  const [d, setD] = useState<Design>(() => initialDesign(templateName, blankFormat));
  const [format, setFormat] = useState<FormatKey>(() => blankFormat ?? ALL_TEMPLATES.find((t) => t.name === templateName)?.format ?? "post");
  const [title, setTitle] = useState(templateName ?? "Mi boceto");
  const [sel, setSel] = useState<string | null>(null);
  const [id, setId] = useState<string | undefined>(designId);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(!!designId);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [fitScale, setFitScale] = useState(.4);
  const [dirty, setDirty] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const dragCleanup = useRef<(() => void) | null>(null);
  const scale = fitScale * zoom;
  const el = d.els.find((e) => e.id === sel);
  const change = (fn: (x: Design) => Design) => { setD(fn); setDirty(true); setMsg(""); };
  const upd = (p: Partial<El>) => change((x) => ({ ...x, els: x.els.map((e) => e.id === sel ? { ...e, ...p } : e) }));

  useEffect(() => {
    if (!designId) {
      const saved = sessionStorage.getItem("dmd_editor_draft");
      if (saved && !templateName && !blankFormat) {
        try { const draft = JSON.parse(saved); if (isDesign(draft.d)) { setD(draft.d); setTitle(draft.title); setFormat(draft.format); setDirty(true); } } catch { /* leave the new canvas intact */ }
        sessionStorage.removeItem("dmd_editor_draft");
      }
      return;
    }
    let active = true;
    supabase.from("designs").select("*").eq("id", designId).maybeSingle().then(({ data, error }) => {
      if (!active) return;
      setLoading(false);
      if (error || !data || !isDesign(data.data)) { setLoadError("No pudimos abrir este diseño. Comprueba tu sesión y vuelve a intentarlo."); return; }
      setD(data.data); setTitle(data.title); setFormat(data.format in FORMATS || data.format === "custom" ? data.format as FormatKey : "custom"); setId(data.id); setDirty(false);
    });
    return () => { active = false; };
  }, [designId, templateName, blankFormat, session?.user.id]);

  useEffect(() => {
    const node = wrap.current;
    if (!node) return;
    const fit = () => setFitScale(Math.max(.03, Math.min((node.clientWidth - 48) / d.w, 560 / d.h, 1)));
    fit(); const observer = new ResizeObserver(fit); observer.observe(node);
    return () => observer.disconnect();
  }, [d.w, d.h, loading, loadError]);
  useEffect(() => () => dragCleanup.current?.(), []);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const add = (type: El["type"]) => {
    const n: El = type === "text"
      ? { id: uid(), type, x: d.w * .1, y: d.h * .4, w: d.w * .8, h: 160, text: "Nuevo texto", size: Math.round(d.w / 16), color: PALETTE[1] ?? "#17252a", bold: true, font: "Arial", align: "center" }
      : { id: uid(), type, x: d.w * .35, y: d.h * .35, w: d.w * .3, h: d.w * .3, color: PALETTE[0] ?? "#0067b8" };
    change((x) => ({ ...x, els: [...x.els, n] })); setSel(n.id);
  };
  const del = () => { change((x) => ({ ...x, els: x.els.filter((e) => e.id !== sel) })); setSel(null); };
  const duplicate = () => { if (!sel) return; const next = duplicateElement(d, sel); change(() => next); setSel(next.els.at(-1)?.id ?? null); };
  const layer = (dir: 1 | -1) => change((x) => {
    const i = x.els.findIndex((e) => e.id === sel), j = i + dir;
    const a = x.els[i], b = x.els[j]; if (!a || !b) return x;
    const els = [...x.els]; els[i] = b; els[j] = a; return { ...x, els };
  });
  const pickFormat = (f: FormatKey) => {
    setFormat(f); if (f === "custom") return;
    const { w, h } = FORMATS[f]; setZoom(1);
    change((x) => ({ ...x, w, h, els: x.els.map((e) => ({ ...e, x: e.x / x.w * w, y: e.y / x.h * h, w: e.w / x.w * w, h: e.h / x.h * h })) }));
  };
  const pickTemplate = (name: string) => {
    const t = ALL_TEMPLATES.find((q) => q.name === name); if (!t) return;
    if (dirty && !confirm("¿Reemplazar los cambios sin guardar por esta plantilla?")) return;
    change(() => t.make()); setFormat(t.format); setTitle(t.name); setSel(null); setZoom(1);
  };
  const drag = (event: React.PointerEvent, item: El, mode: "move" | "resize") => {
    event.stopPropagation(); event.preventDefault(); setSel(item.id); dragCleanup.current?.();
    const sx = event.clientX, sy = event.clientY, original = { ...item };
    const move = (ev: PointerEvent) => {
      const dx = (ev.clientX - sx) / scale, dy = (ev.clientY - sy) / scale;
      change((x) => ({ ...x, els: x.els.map((q) => q.id !== item.id ? q : mode === "move" ? { ...q, x: original.x + dx, y: original.y + dy } : { ...q, w: Math.max(20, original.w + dx), h: Math.max(20, original.h + dy) }) }));
    };
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); dragCleanup.current = null; };
    dragCleanup.current = up;
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
  };
  const download = () => {
    try {
      const url = renderToCanvas(d).toDataURL("image/png");
      const bytes = Uint8Array.from(atob(url.split(",")[1] ?? ""), (ch) => ch.charCodeAt(0));
      downloadBlob(new Blob([bytes], { type: "image/png" }), `${title || "boceto"}.png`);
      setMsg("PNG descargado.");
    } catch { setMsg("No se pudo exportar la imagen. Intenta con un tamaño menor."); }
  };
  const save = async () => {
    if (!session || saving) return;
    setSaving(true); setMsg("Guardando…");
    try {
      const row = { title: title || "Mi boceto", format, data: d as never, updated_at: new Date().toISOString() };
      const res = id ? await supabase.from("designs").update(row).eq("id", id).select("id").single() : await supabase.from("designs").insert({ ...row, user_id: session.user.id }).select("id").single();
      if (res.error) { setMsg("No se pudo guardar. Vuelve a intentarlo."); return; }
      setId(res.data.id); setDirty(false); setMsg("¡Guardado en tu cuenta!");
      await qc.invalidateQueries({ queryKey: ["designs"] });
      if (!id) void nav({ to: "/boceto", search: { id: res.data.id }, replace: true });
    } catch { setMsg("No se pudo guardar. Comprueba tu conexión."); }
    finally { setSaving(false); }
  };
  const selectClass = "h-9 w-full rounded-md border bg-background px-2 text-sm";

  if (loading) return <p className="p-12 text-center" role="status">Abriendo diseño…</p>;
  if (loadError) return <div className="mx-auto max-w-xl p-12 text-center"><p role="alert">{loadError}</p><Button asChild className="mt-5"><Link to="/estudio">Volver al estudio</Link></Button></div>;
  return <TooltipProvider delayDuration={150}><div className="mx-auto max-w-[1500px] px-3 py-6 md:px-5">
    <div className="flex flex-wrap items-center gap-3 border-b pb-5">
      <Tool label="Volver al estudio" onClick={() => { if (!dirty || confirm("¿Salir sin guardar los cambios?")) void nav({ to: "/estudio" }); }}><ArrowLeft /></Tool>
      <div className="min-w-0 flex-1"><h1 className="text-lg font-bold">Editor DMD</h1><span className="text-xs text-muted-foreground">{dirty ? "Cambios sin guardar" : "Estudio creativo"}</span></div>
      <Input aria-label="Nombre del diseño" className="order-last w-full md:order-none md:w-60" value={title} maxLength={60} onChange={(e) => { setTitle(e.target.value); setDirty(true); }} />
      <Button variant="outline" onClick={download}><Download /><span className="hidden sm:inline">PNG</span></Button>
      {session ? <Button onClick={save} disabled={saving}><Save />{saving ? "Guardando…" : "Guardar"}</Button> : <Button asChild><Link to="/auth" search={{ redirect: id ? `/boceto?id=${id}` : "/boceto" }} onClick={() => { if (!id) sessionStorage.setItem("dmd_editor_draft", JSON.stringify({ d, title, format })); }}>Iniciar sesión para guardar</Link></Button>}
    </div>
    <div className="grid gap-5 pt-5 lg:grid-cols-[210px_minmax(0,1fr)_240px]">
      <aside className="space-y-4 lg:border-r lg:pr-4">
        <div><h2 className="mb-2 text-sm font-semibold">Plantillas</h2><select aria-label="Elegir plantilla" className={selectClass} value={ALL_TEMPLATES.some((t) => t.name === title) ? title : ""} onChange={(e) => pickTemplate(e.target.value)}><option value="" disabled>Seleccionar plantilla</option>{ALL_TEMPLATES.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}</select></div>
        <div><label htmlFor="design-format" className="mb-2 block text-sm font-semibold">Formato</label><select id="design-format" className={selectClass} value={format} onChange={(e) => pickFormat(e.target.value as FormatKey)}>{Object.entries(FORMATS).map(([k, f]) => <option key={k} value={k}>{f.label}</option>)}<option value="custom">Personalizada</option></select></div>
        {format === "custom" && <div className="grid grid-cols-2 gap-2"><label className="text-xs">Ancho<Input aria-label="Ancho" type="number" value={d.w} min={200} max={4000} onChange={(e) => change((x) => ({ ...x, w: Math.min(4000, Math.max(200, Number(e.target.value))) }))} /></label><label className="text-xs">Alto<Input aria-label="Alto" type="number" value={d.h} min={200} max={4000} onChange={(e) => change((x) => ({ ...x, h: Math.min(4000, Math.max(200, Number(e.target.value))) }))} /></label></div>}
        <Button variant="outline" className="w-full" onClick={() => { if (!dirty || confirm("¿Vaciar el lienzo y descartar los cambios sin guardar?")) { change(() => blank(d.w, d.h)); setSel(null); } }}><Plus /> Lienzo en blanco</Button>
        <div className="flex flex-wrap gap-2 border-t pt-4"><Button variant="secondary" onClick={() => add("text")}><Type /> Texto</Button><Tool label="Añadir rectángulo" onClick={() => add("rect")}><Square /></Tool><Tool label="Añadir círculo" onClick={() => add("circle")}><Circle /></Tool></div>
        <div className="border-t pt-4"><h2 className="mb-2 text-sm font-semibold">Elementos</h2><div className="flex max-h-44 flex-col gap-1 overflow-y-auto lg:max-h-80">{d.els.map((item, i) => <Button variant={sel === item.id ? "secondary" : "ghost"} key={item.id} className="w-full justify-start" onClick={() => setSel(item.id)}><span className="truncate">{item.type === "text" ? item.text || "Texto" : `${item.type === "rect" ? "Rectángulo" : "Círculo"} ${i + 1}`}</span></Button>)}</div></div>
      </aside>
      <section className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-muted-foreground">{Math.round(d.w)} × {Math.round(d.h)} px</span><div className="flex items-center gap-1"><Tool label="Alejar" onClick={() => setZoom((z) => Math.max(.25, z / 1.25))}><ZoomOut /></Tool><span className="w-12 text-center text-xs" aria-label="Nivel de zoom">{Math.round(scale * 100)}%</span><Tool label="Acercar" onClick={() => setZoom((z) => Math.min(4, z * 1.25))}><ZoomIn /></Tool><Tool label="Ajustar al espacio" onClick={() => setZoom(1)}><Maximize /></Tool></div></div>
        <div ref={wrap} className="editor-workspace h-[620px] w-full overflow-auto rounded-lg border" onPointerDown={() => setSel(null)}>
          <div className="grid min-h-full min-w-full place-items-center p-6" style={{ width: d.w * scale + 48, minHeight: Math.max(620, d.h * scale + 48) }}>
            <div className="relative shrink-0" style={{ width: d.w * scale, height: d.h * scale }}><div className="editor-artboard" aria-label="Lienzo de diseño" style={{ width: d.w, height: d.h, background: d.bg, transform: `scale(${scale})` }}>
              {d.els.map((item) => <div key={item.id} onPointerDown={(ev) => drag(ev, item, "move")} className={`editor-element ${sel === item.id ? "outline outline-2 outline-primary" : ""}`} style={{ left: item.x, top: item.y, width: item.w, height: item.h, background: item.type === "text" ? "transparent" : item.color, borderRadius: item.type === "circle" ? "50%" : 0, color: item.color, fontSize: item.size ?? 48, fontFamily: item.font, fontWeight: item.bold ? 700 : 400, textAlign: item.align }}>
                {item.type === "text" && item.text}
                {sel === item.id && <span aria-label="Redimensionar elemento" onPointerDown={(ev) => drag(ev, item, "resize")} className="absolute bottom-0 right-0 cursor-se-resize border border-background bg-primary" style={{ width: 12 / scale, height: 12 / scale }} />}
              </div>)}
            </div></div>
          </div>
        </div>
        <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">{msg}</p>
      </section>
      <aside className="space-y-4 lg:border-l lg:pl-4">
        <h2 className="font-semibold">{el ? "Elemento seleccionado" : "Fondo del diseño"}</h2>
        <div className="flex flex-wrap gap-2">{PALETTE.map((color) => <Button key={color} size="icon" variant="outline" aria-label={`Usar color ${color}`} className="h-7 w-7 rounded-full" style={{ background: color }} onClick={() => el ? upd({ color }) : change((x) => ({ ...x, bg: color }))} />)}<input type="color" aria-label={el ? "Color del elemento" : "Color de fondo"} value={el?.color ?? d.bg} onChange={(e) => el ? upd({ color: e.target.value }) : change((x) => ({ ...x, bg: e.target.value }))} className="h-8 w-10 rounded border" /></div>
        {el?.type === "text" && <>
          <label className="block text-xs">Texto<textarea aria-label="Contenido del texto" className="mt-2 min-h-24 w-full rounded-md border bg-background p-2 text-sm" value={el.text ?? ""} onChange={(e) => upd({ text: e.target.value })} /></label>
          <select aria-label="Fuente del texto" className={selectClass} value={el.font ?? "Arial"} onChange={(e) => upd({ font: e.target.value })}>{FONTS.map((font) => <option key={font}>{font}</option>)}</select>
          <label className="block text-xs">Tamaño del texto<Input aria-label="Tamaño del texto" type="number" min={12} max={300} value={el.size ?? 48} onChange={(e) => upd({ size: Math.min(300, Math.max(12, Number(e.target.value))) })} /></label>
          <div className="flex gap-1"><Tool label="Negrita" onClick={() => upd({ bold: !el.bold })}><Bold /></Tool><Tool label="Alinear a la izquierda" onClick={() => upd({ align: "left" })}><AlignLeft /></Tool><Tool label="Centrar texto" onClick={() => upd({ align: "center" })}><AlignCenter /></Tool><Tool label="Alinear a la derecha" onClick={() => upd({ align: "right" })}><AlignRight /></Tool></div>
        </>}
        {el && <><div className="grid grid-cols-2 gap-2"><label className="text-xs">Posición X<Input aria-label="Posición X" type="number" value={Math.round(el.x)} onChange={(e) => upd({ x: Number(e.target.value) })} /></label><label className="text-xs">Posición Y<Input aria-label="Posición Y" type="number" value={Math.round(el.y)} onChange={(e) => upd({ y: Number(e.target.value) })} /></label></div><div className="flex gap-2"><Tool label="Duplicar elemento" onClick={duplicate}><Copy /></Tool><Tool label="Traer al frente" onClick={() => layer(1)}><ArrowUp /></Tool><Tool label="Enviar atrás" onClick={() => layer(-1)}><ArrowDown /></Tool><Tool label="Eliminar elemento" onClick={del}><Trash2 /></Tool></div></>}
        <div className="border-t pt-4"><Button asChild variant="secondary" className="h-auto w-full whitespace-normal py-3"><a href={whatsapp(`Hola DMD, hice un boceto en su editor: "${title}" (${Math.round(d.w)}×${Math.round(d.h)}). ¿Me ayudan a terminarlo?`)} target="_blank" rel="noreferrer">Consultar a DMD por WhatsApp</a></Button></div>
      </aside>
    </div>
  </div></TooltipProvider>;
}
