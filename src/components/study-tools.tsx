import { useState } from "react";
import { Network, ListChecks, Table2, Volume2, Square, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Notebook } from "@/lib/aulaplus";
import { mindMap, makeQuiz, dataTable, summarize } from "@/lib/tutor";

type Tool = "map" | "quiz" | "table" | "audio";

export function StudyTools({ notebook }: { notebook: Notebook }) {
  const [tool, setTool] = useState<Tool>("map");
  const [picked, setPicked] = useState<Record<number, string>>({});
  const [speaking, setSpeaking] = useState(false);
  const text = notebook.notes;
  if (text.trim().length < 40)
    return <div className="tools-empty"><h3>Primero agrega apuntes</h3><p className="text-muted-foreground">Escribe en Apuntes o sube un archivo en el chat para generar mapas mentales, cuestionarios y más.</p></div>;
  const map = mindMap(notebook.name, text);
  const quiz = makeQuiz(text);
  const table = dataTable(text);
  const summary = summarize(text, 4);
  function speak() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(`Resumen de ${notebook.name}. ${summary.join(" ")}`);
    u.lang = "es-ES";
    u.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }
  const tabs: { id: Tool; label: string; icon: typeof Network }[] = [
    { id: "map", label: "Mapa mental", icon: Network },
    { id: "quiz", label: "Cuestionario", icon: ListChecks },
    { id: "table", label: "Tabla de datos", icon: Table2 },
    { id: "audio", label: "Resumen en audio", icon: Volume2 },
  ];
  return (
    <div className="study-tools">
      <div className="tool-switch">
        {tabs.map((t) => <Button key={t.id} variant={tool === t.id ? "default" : "outline"} size="sm" onClick={() => setTool(t.id)}><t.icon />{t.label}</Button>)}
      </div>
      {tool === "map" && <div className="mind-map">
        <div className={`mind-center tone-${notebook.tone}`}>{map.center}</div>
        <div className="mind-branches">{map.branches.map((b) => <div className="mind-branch" key={b.label}><strong>{b.label}</strong><p>{b.detail}</p></div>)}</div>
      </div>}
      {tool === "quiz" && <div className="quiz">
        {quiz.length === 0 && <p className="text-muted-foreground">Necesito apuntes un poco más largos para crear preguntas.</p>}
        {quiz.map((q, i) => <div className="quiz-item" key={i}>
          <p><strong>{i + 1}.</strong> {q.question}</p>
          <div className="quiz-options">{q.options.map((o) => {
            const chosen = picked[i] === o; const done = picked[i] !== undefined;
            return <Button key={o} size="sm" variant="outline" disabled={done} className={done && o === q.answer ? "quiz-right" : chosen ? "quiz-wrong" : ""} onClick={() => setPicked((p) => ({ ...p, [i]: o }))}>
              {done && o === q.answer && <Check />}{chosen && o !== q.answer && <X />}{o}
            </Button>;
          })}</div>
        </div>)}
        {quiz.length > 0 && <p className="text-sm font-bold">Aciertos: {quiz.filter((q, i) => picked[i] === q.answer).length} / {quiz.length}</p>}
      </div>}
      {tool === "table" && <div className="overflow-x-auto"><table className="data-table">
        <thead><tr><th>Concepto</th><th>Veces</th><th>Contexto</th></tr></thead>
        <tbody>{table.map((r) => <tr key={r.term}><td><strong>{r.term}</strong></td><td>{r.count}</td><td>{r.context}</td></tr>)}</tbody>
      </table></div>}
      {tool === "audio" && <div className="audio-summary">
        <ul>{summary.map((s) => <li key={s}>{s}</li>)}</ul>
        {speaking
          ? <Button variant="outline" onClick={() => { window.speechSynthesis.cancel(); setSpeaking(false); }}><Square />Detener</Button>
          : <Button onClick={speak}><Volume2 />Escuchar resumen</Button>}
      </div>}
    </div>
  );
}
