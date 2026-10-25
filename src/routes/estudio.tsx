import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, ArrowUpRight, LayoutGrid, FolderOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TemplatePreview } from "@/components/editor/TemplatePreview";
import { DesignList } from "@/components/editor/DesignList";
import { CATEGORIES, filterTemplates } from "@/lib/studio";
import { FORMATS, type FormatKey } from "@/lib/editor";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/estudio")({
  head: () => ({ meta: [
    { title: "Estudio creativo | DMD · Mejores Ideas Hub" },
    { name: "description", content: "Crea diseños originales con plantillas de redes, presentaciones, documentos, branding y más. Guarda y abre tus proyectos en DMD." },
    { property: "og:title", content: "Estudio creativo DMD" },
    { property: "og:description", content: "Tus ideas, tu espacio creativo. Plantillas originales y editor visual integrado." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Studio,
});

function Studio() {
  const { session } = useAuth();
  const [category, setCategory] = useState("Todas");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"templates" | "designs">("templates");
  const [format, setFormat] = useState<FormatKey>("post");
  const templates = filterTemplates(query, category);
  return <div className="mx-auto max-w-7xl px-5 py-10 md:py-14">
    <div className="flex flex-wrap items-end justify-between gap-6 border-b pb-8">
      <div><p className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles size={16} /> DMD / MEJORES IDEAS HUB</p><h1 className="text-3xl font-bold md:text-4xl">Estudio creativo</h1><p className="mt-3 text-muted-foreground">Un espacio para dar forma a tus ideas.</p></div>
      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
        <select aria-label="Formato del nuevo diseño" className="h-10 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm sm:max-w-52" value={format} onChange={(e) => setFormat(e.target.value as FormatKey)}>{Object.entries(FORMATS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
        <Button asChild className="h-10"><Link to="/boceto" search={{ blank: format }}><Plus /> Crear diseño</Link></Button>
      </div>
    </div>
    <div className="mt-7 flex gap-2 border-b pb-4"><Button variant={tab === "templates" ? "secondary" : "ghost"} onClick={() => setTab("templates")} aria-pressed={tab === "templates"}><LayoutGrid /> Plantillas</Button><Button variant={tab === "designs" ? "secondary" : "ghost"} onClick={() => setTab("designs")} aria-pressed={tab === "designs"}><FolderOpen /> Mis diseños</Button></div>
    {tab === "templates" ? <>
      <div className="my-7 flex flex-col gap-5 lg:flex-row lg:items-center"><h2 className="shrink-0 text-xl font-semibold">Encuentra tu punto de partida</h2><div className="relative w-full lg:ml-auto lg:max-w-md"><Search className="absolute left-3 top-3 text-muted-foreground" size={18} /><Input aria-label="Buscar plantillas" placeholder="Buscar plantillas…" value={query} onChange={(e) => setQuery(e.target.value)} className="h-11 pl-10" type="search" /></div></div>
      <div className="flex gap-2 overflow-x-auto pb-4" aria-label="Categorías de plantillas">{CATEGORIES.map((c) => <Button key={c} variant={category === c ? "default" : "outline"} onClick={() => setCategory(c)} aria-pressed={category === c} className="shrink-0">{c}</Button>)}</div>
      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground"><span>{category === "Todas" ? "Colección original DMD" : category}</span><span>{templates.length} plantillas</span></div>
      {templates.length ? <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{templates.map((t) => <article key={t.name} className="group overflow-hidden rounded-lg border bg-card"><Link to="/boceto" search={{ template: t.name }} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><TemplatePreview template={t} /><div className="flex items-start justify-between gap-2 p-4"><div className="min-w-0"><h3 className="text-sm font-semibold">{t.name}</h3><p className="mt-1 text-xs text-muted-foreground">{t.cat}</p></div><ArrowUpRight size={17} className="shrink-0 text-primary" /></div></Link></article>)}</div> : <p role="status" className="py-20 text-center text-muted-foreground">No hay plantillas que coincidan con tu búsqueda.</p>}
    </> : <section className="py-7"><h2 className="text-xl font-semibold">Mis diseños</h2>{session ? <DesignList userId={session.user.id} /> : <div className="py-14 text-center"><p className="mb-5 text-muted-foreground">Inicia sesión para ver tus diseños guardados.</p><Button asChild><Link to="/auth" search={{ redirect: "/estudio" }}>Iniciar sesión</Link></Button></div>}</section>}
  </div>;
}