export type Role = "student" | "teacher";
export type Evaluation = "Perfecto" | "Bien" | "Necesita Repaso";
export const evaluationPoints: Record<Evaluation, number> = {
  Perfecto: 2,
  Bien: 1,
  "Necesita Repaso": 0,
};
export function evaluate(points: number, grade: Evaluation) {
  return points + evaluationPoints[grade];
}
export function petLevel(points: number) {
  return Math.floor(Math.max(0, points) / 10) + 1;
}
export function makeGroups<T>(students: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let i = 0; i < students.length; i += Math.max(2, Math.floor(size)))
    groups.push(students.slice(i, i + Math.max(2, Math.floor(size))));
  return groups;
}
export type Notebook = {
  id: string;
  name: string;
  subject: string;
  tone: string;
  pet: string;
  points: number;
  streak: number;
  notes: string;
  tasks: { id: string; title: string; done: boolean }[];
};
export type Activity = { id: string; title: string; date: string; type: string; subject: string };
export type Student = { id: string; name: string; points: number; tone: string };
export type Workspace = {
  notebooks: Notebook[];
  activities: Activity[];
  students: Student[];
  announcements: { id: string; title: string; body: string }[];
};
export const initialWorkspace: Workspace = {
  notebooks: [
    {
      id: "math",
      name: "Matemáticas",
      subject: "Números que cuentan historias",
      tone: "mint",
      pet: "Milo",
      points: 24,
      streak: 5,
      notes:
        "Las fracciones representan partes de un todo. Para sumar fracciones, primero buscamos un denominador común.",
      tasks: [{ id: "m1", title: "Resolver los ejercicios de fracciones", done: false }],
    },
    {
      id: "science",
      name: "Ciencias Naturales",
      subject: "Un mundo por descubrir",
      tone: "sky",
      pet: "Blu",
      points: 16,
      streak: 3,
      notes:
        "La fotosíntesis transforma la energía solar en energía química. Las plantas utilizan agua y dióxido de carbono.",
      tasks: [{ id: "c1", title: "Dibujar las partes de una planta", done: false }],
    },
    {
      id: "language",
      name: "Comunicación",
      subject: "Cada palabra es una aventura",
      tone: "peach",
      pet: "Coco",
      points: 32,
      streak: 7,
      notes:
        "Un texto narrativo tiene inicio, desarrollo y desenlace. Sus personajes viven una historia en un tiempo y lugar.",
      tasks: [{ id: "l1", title: "Escribir un cuento corto", done: true }],
    },
    {
      id: "history",
      name: "Historia",
      subject: "Viajes a través del tiempo",
      tone: "lilac",
      pet: "Lumi",
      points: 12,
      streak: 2,
      notes:
        "Las fuentes históricas nos ayudan a conocer el pasado. Pueden ser escritas, orales o materiales.",
      tasks: [],
    },
  ],
  activities: [
    {
      id: "a1",
      title: "Examen de fracciones",
      date: "2026-10-12",
      type: "Examen",
      subject: "Matemáticas",
    },
    {
      id: "a2",
      title: "Mi pequeña planta",
      date: "2026-10-14",
      type: "Proyecto",
      subject: "Ciencias Naturales",
    },
    {
      id: "a3",
      title: "Lectura de 20 minutos",
      date: "2026-10-09",
      type: "Estudio",
      subject: "Comunicación",
    },
  ],
  students: [
    "Valentina López",
    "Mateo García",
    "Sofía Torres",
    "Lucas Pérez",
    "Camila Ramos",
    "Diego Flores",
    "Emma Silva",
    "Nicolás Ruiz",
    "Isabella Vega",
    "Gabriel León",
    "Luciana Castro",
    "Sebastián Díaz",
  ].map((name, i) => ({
    id: String(i),
    name,
    points: 10 + i * 2,
    tone: ["mint", "sky", "peach", "lilac"][i % 4] || "mint",
  })),
  announcements: [
    {
      id: "n1",
      title: "¡Nuestra próxima aventura!",
      body: "El miércoles presentaremos nuestros proyectos de ciencias. Recuerda traer tu pequeña planta.",
    },
  ],
};
