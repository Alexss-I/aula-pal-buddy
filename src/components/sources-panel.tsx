import { useState } from "react";
import { Link2, FileText, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Notebook } from "@/lib/aulaplus";
import { fetchSource } from "@/lib/fetch-source.functions";
import { readStudyFile } from "@/lib/file-reader";
import { summarize } from "@/lib/tutor";

export function SourcesPanel({ notebook: n, update }: { notebook: Notebook; update: (n: Notebook) => void }) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const sources = n.sources ?? [];
  const add = (title: string, kind: "link" | "texto" | "archivo", body: string) => {
    update({ ...n, notes: `${n.notes ? n.notes + "\n\n" : ""}📎 ${title}\n${body}`, sources: [...sources, { id: crypto.randomUUID(), title, kind }] });
    const s = summarize(body, 2);
    toast.success(`Fuente añadida: ${title}`, s.length ? { description: s.join(" ").slice(0, 200) } : undefined);
  };
  async function addUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!/^https?:\/\/\S+\.\S+/.test(url.trim())) { toast.error("Pega un enlace válido (https://…)"); return; }
    setBusy(true);
    try {
      const r = await fetchSource({ data: { url: url.trim() } });
      if (!r.ok || !r.text) toast.error(r.error || "No encontré texto en ese enlace");
      else { add(r.title, "link", r.text); setUrl(""); }
    } catch { toast.error("No se pudo leer ese enlace"); }
    setBusy(false);
  }
  return (
    <div className="sources-panel">
      <h2>Fuentes del cuaderno</h2>
      <p className="subtitle">Milo lee y usa estas fuentes para responder, resumir y crear flashcards.</p>
      <form className="inline-form" onSubmit={addUrl}>
        <input className="field" aria-label="Enlace" placeholder="Pega un enlace de internet…" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Button type="submit" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <Link2 />}Añadir enlace</Button>
      </form>
      <textarea className="field min-h-32" aria-label="Texto de la fuente" placeholder="…o pega aquí un texto" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" disabled={!text.trim()} onClick={() => { add(text.trim().slice(0, 40) + "…", "texto", text.trim()); setText(""); }}><FileText />Añadir texto</Button>
        <label className="upload-btn">
          <input type="file" hidden accept=".pdf,.docx,.xlsx,.pptx,.txt,.md,.csv" onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            const r = await readStudyFile(f);
            if (r.text.trim()) add(r.name, "archivo", r.text.trim().slice(0, 20000)); else toast.error(r.note ?? "No encontré texto");
            e.target.value = "";
          }} />
          <FileText size={16} />Subir documento
        </label>
      </div>
      <ul className="source-list">
        {!sources.length && <li className="subtitle">Aún no hay fuentes. ¡Añade la primera!</li>}
        {sources.map((s) => (
          <li key={s.id}>
            <span className="pill sky">{s.kind}</span><span className="flex-1 truncate">{s.title}</span>
            <Button size="icon" variant="ghost" aria-label={`Quitar ${s.title}`} onClick={() => update({ ...n, sources: sources.filter((x) => x.id !== s.id) })}><Trash2 /></Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
