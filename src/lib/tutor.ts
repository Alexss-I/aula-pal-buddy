// Tutor local (sin IA externa): responde conocimiento general y usa los apuntes como apoyo.
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function solveMath(question: string): { expr: string; result: number } | null {
  let q = norm(question)
    .replace(/(\d)\s*x\s*(\d)/g, "$1*$2")
    .replace(/por/g, "*").replace(/multiplicado/g, "*").replace(/mas/g, "+").replace(/menos/g, "-")
    .replace(/dividido( entre)?|entre/g, "/").replace(/×/g, "*").replace(/÷/g, "/").replace(/\^/g, "**")
    .replace(/,/g, ".");
  const m = q.match(/[\d(][\d+\-*/.()\s]*[\d)]/g);
  if (!m) return null;
  const expr = m.sort((a, b) => b.length - a.length)[0]!.trim();
  if (!/[+\-*/]/.test(expr) || !/^[\d+\-*/.()\s]+$/.test(expr)) return null;
  try {
    const result = Function(`"use strict";return (${expr})`)() as number;
    if (typeof result !== "number" || !Number.isFinite(result)) return null;
    return { expr: expr.replace(/\*\*/g, "^"), result: Math.round(result * 1e6) / 1e6 };
  } catch { return null; }
}

const topics: { keys: string[]; text: string }[] = [
  { keys: ["fotosintesis"], text: "La **fotosíntesis** es el proceso con el que las plantas fabrican su alimento 🌿.\n\n- Usan **luz solar**, **agua** (que absorben por las raíces) y **dióxido de carbono** (del aire).\n- En las hojas, gracias a la **clorofila**, los transforman en **glucosa** (energía).\n- Liberan **oxígeno**, ¡el que respiramos!\n\nFórmula sencilla: agua + CO₂ + luz → glucosa + oxígeno." },
  { keys: ["fraccion"], text: "Una **fracción** representa partes de un todo: el **numerador** (arriba) dice cuántas partes tomas y el **denominador** (abajo) en cuántas se divide.\n\nEjemplo: 🍕 dividida en 4 y comes 1 → **1/4**.\nPara sumar fracciones busca un **denominador común**: 1/2 + 1/4 = 2/4 + 1/4 = **3/4**." },
  { keys: ["celula"], text: "La **célula** es la unidad más pequeña de vida 🔬. Tiene **membrana** (la protege), **citoplasma** (donde ocurren procesos) y **núcleo** (guarda el ADN). Las vegetales además tienen pared celular y cloroplastos." },
  { keys: ["agua", "ciclo"], text: "El **ciclo del agua** 💧: **evaporación** (el sol calienta el agua) → **condensación** (forma nubes) → **precipitación** (lluvia) → **escorrentía/infiltración** (vuelve a ríos y mares)." },
  { keys: ["sustantivo"], text: "Un **sustantivo** es la palabra que nombra personas, animales, cosas o ideas: *perro, María, mesa, alegría*." },
  { keys: ["verbo"], text: "Un **verbo** expresa acciones, estados o procesos: *correr, ser, crecer*. Cambia según la persona y el tiempo (yo corro, ellos corrieron)." },
  { keys: ["sistema solar", "planetas"], text: "El **sistema solar** 🪐 tiene 8 planetas: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno. Un truco: *\"Mi Vieja Tía Mara Jamás Supo Usar Nada\"*." },
  { keys: ["texto narrativo", "narrativo"], text: "Un **texto narrativo** cuenta una historia con **inicio**, **desarrollo** y **desenlace**, con personajes, tiempo y lugar." },
];

const studyTips = "Aquí van mis mejores consejos de estudio 📚✨\n\n1. **Pomodoro**: 25 min de estudio y 5 de descanso.\n2. **Explícalo con tus palabras**, como si enseñaras a un amigo.\n3. **Repasa con flashcards** en días distintos (repaso espaciado).\n4. **Duerme bien**: tu cerebro guarda lo aprendido mientras descansas.\n5. Estudia sin el celular cerca 📵.";

export function tutorReply(question: string, notes: string, subject: string): string {
  const q = norm(question.trim());
  if (!q) return "¡Escríbeme tu duda y la resolvemos juntos! 😊";
  if (/^(hola|buenas|hey|buenos)/.test(q) && q.length < 25)
    return `¡Hola! 👋 Soy tu tutor. Puedo ayudarte con **${subject}** o con cualquier duda escolar: matemáticas, ciencias, lenguaje o consejos de estudio. ¿Qué quieres aprender hoy?`;
  const math = solveMath(question);
  if (math) return `¡Vamos a calcularlo! 🧮\n\n**${math.expr} = ${math.result}**\n\n¿Quieres que te explique el procedimiento paso a paso o probamos otro ejercicio?`;
  if (/consejo|tip|como estudiar|concentr|memoriz/.test(q)) return studyTips;
  if (/gracias/.test(q)) return "¡De nada! 💚 Sigue así, cada pregunta te hace más fuerte.";
  const topic = topics.find((t) => t.keys.some((k) => q.includes(k)));
  const words = q.split(/\W+/).filter((w) => w.length > 4);
  const sentences = notes.split(/(?<=\.)\s+/).filter(Boolean);
  const related = sentences.filter((s) => words.some((w) => norm(s).includes(w)));
  const fromNotes = related.length ? `\n\n📒 **En tus apuntes:** _${related.slice(0, 2).join(" ")}_` : "";
  if (topic) return topic.text + fromNotes + "\n\n¿Te preparo una pregunta de práctica?";
  if (related.length) return `¡Buena pregunta! Según tus apuntes de **${subject}**:\n\n_${related.slice(0, 2).join(" ")}_\n\nIntenta explicarlo con tus palabras y buscar un ejemplo de la vida diaria. ¿Lo intentamos juntos?`;
  return `¡Buena pregunta! 🌱 Pensémosla como lo haría un buen estudiante:\n\n1. **Identifica la idea clave** de "${question.trim().slice(0, 80)}".\n2. **Divide el problema** en partes pequeñas.\n3. **Busca un ejemplo** cercano a tu vida.\n\nCuéntame un poco más (¿de qué tema o materia es?) y te lo explico con detalle. *(Tutor de demostración)*`;
}
