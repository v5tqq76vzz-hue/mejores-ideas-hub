import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";

const safe = (p?: string) => (p && p.startsWith("/") && !p.startsWith("//") ? p : "/cuenta");

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s.redirect === "string" ? s.redirect : undefined }),
  head: () => ({
    meta: [
      { title: "Iniciar sesión | DMD" },
      { name: "description", content: "Entra a tu cuenta de Digital Majfa Dreams para ver tus pedidos." },
      { property: "og:title", content: "Iniciar sesión | DMD" },
      { property: "og:description", content: "Accede a tu portal de cliente DMD." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const nav = useNavigate();
  const { session } = useAuth();
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [f, setF] = useState({ name: "", email: "", pass: "" });
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const dest = safe(redirect);

  useEffect(() => { if (session) nav({ to: dest, replace: true }); }, [session, dest, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.pass });
      if (error) setMsg({ ok: false, t: "Correo o contraseña incorrectos." });
    } else if (mode === "up") {
      const { error } = await supabase.auth.signUp({
        email: f.email, password: f.pass,
        options: { emailRedirectTo: window.location.origin + dest, data: { full_name: f.name } },
      });
      setMsg(error ? { ok: false, t: error.message } : { ok: true, t: "Revisa tu correo para confirmar tu cuenta." });
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(f.email, { redirectTo: `${window.location.origin}/reset-password` });
      setMsg(error ? { ok: false, t: error.message } : { ok: true, t: "Te enviamos un enlace para cambiar tu contraseña." });
    }
    setBusy(false);
  };

  const google = async () => {
    sessionStorage.setItem("dmd_after_login", dest);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) setMsg({ ok: false, t: "No se pudo entrar con Google." });
  };

  const field = "w-full rounded-xl border bg-background px-4 py-3";
  return (
    <section className="bg-hero">
      <div className="mx-auto max-w-md px-5 py-16">
        <div className="rounded-3xl border bg-card p-7 shadow-card">
          <h1 className="text-2xl font-bold">{mode === "in" ? "Inicia sesión" : mode === "up" ? "Crea tu cuenta" : "Recupera tu contraseña"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Consulta tus pedidos y su avance.</p>
          {mode !== "forgot" && (
            <>
              <button onClick={google} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border bg-background py-3 font-semibold">
                <span className="font-bold text-primary">G</span> Continuar con Google
              </button>
              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />o con tu correo<span className="h-px flex-1 bg-border" /></div>
            </>
          )}
          <form onSubmit={submit} className={`space-y-3 ${mode === "forgot" ? "mt-6" : ""}`}>
            {mode === "up" && <input required className={field} placeholder="Nombre" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} maxLength={80} />}
            <input required type="email" className={field} placeholder="Correo" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            {mode !== "forgot" && <input required type="password" minLength={6} className={field} placeholder="Contraseña" value={f.pass} onChange={(e) => setF({ ...f, pass: e.target.value })} />}
            <button disabled={busy} className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground shadow-elegant disabled:opacity-60">
              {mode === "in" ? "Entrar" : mode === "up" ? "Crear cuenta" : "Enviar enlace"}
            </button>
          </form>
          {msg && <p className={`mt-4 text-sm ${msg.ok ? "text-success" : "text-destructive"}`}>{msg.t}</p>}
          <div className="mt-5 flex flex-col gap-2 text-center text-sm">
            {mode === "in" && <button onClick={() => setMode("forgot")} className="text-muted-foreground">¿Olvidaste tu contraseña?</button>}
            <button onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }} className="font-semibold text-primary">
              {mode === "in" ? "¿No tienes cuenta? Regístrate" : "Ya tengo cuenta"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
