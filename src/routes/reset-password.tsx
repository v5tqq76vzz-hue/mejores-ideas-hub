import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nueva contraseña | DMD" },
      { name: "description", content: "Elige una nueva contraseña para tu cuenta DMD." },
      { property: "og:title", content: "Nueva contraseña | DMD" },
      { property: "og:description", content: "Cambia tu contraseña." },
    ],
  }),
  component: Reset,
});

function Reset() {
  const nav = useNavigate();
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: p });
    if (error) setErr("El enlace venció. Pide uno nuevo."); else nav({ to: "/cuenta" });
  };
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <form onSubmit={save} className="space-y-4 rounded-3xl border bg-card p-7 shadow-card">
        <h1 className="text-2xl font-bold">Nueva contraseña</h1>
        <input required type="password" minLength={6} value={p} onChange={(e) => setP(e.target.value)} placeholder="Nueva contraseña" className="w-full rounded-xl border bg-background px-4 py-3" />
        <button className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground">Guardar</button>
        {err && <p className="text-sm text-destructive">{err}</p>}
      </form>
    </div>
  );
}
