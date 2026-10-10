import { useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import type { Notebook } from "@/lib/aulaplus";
import mascot from "@/assets/mascot.png";
import { tutorReply } from "@/lib/tutor";

type ChatMsg = { id: string; role: "user" | "assistant"; text: string };

// Conversaciones en memoria por cuaderno (se mantienen mientras la página esté abierta).
const memory = new Map<string, ChatMsg[]>();

function mockReply(question: string, n: Notebook) { return tutorReply(question, n.notes, n.name); }
function _old(question: string, n: Notebook) {
  const first = n.notes.split(".")[0]?.trim();
  return `¡Buena pregunta sobre **${n.name}**! 🌱\n\nSegún tus apuntes: _${first || "aún no tienes apuntes"}_.\n\nVamos paso a paso:\n1. Lee de nuevo la idea principal.\n2. Escribe con tus palabras qué significa "${question.slice(0, 60)}".\n3. Busca un ejemplo de la vida diaria.\n\n¿Me cuentas qué entendiste del paso 1? *(Respuesta de demostración)*`;
}

export function StudyChat({ notebook }: { notebook: Notebook }) {
  const [messages, setMessages] = useState<ChatMsg[]>(() => memory.get(notebook.id) ?? []);
  const [thinking, setThinking] = useState(false);
  const push = (list: ChatMsg[]) => {
    memory.set(notebook.id, list);
    setMessages(list);
  };
  return (
    <div className="chat-panel">
      <Conversation className="flex-1 min-h-0">
        <ConversationContent>
          {!messages.length && (
            <div className="chat-empty">
              <img src={mascot} alt="Milo" width={1024} height={1024} />
              <h3>¡Una buena pregunta lo cambia todo!</h3>
              <p className="text-muted-foreground">¿Qué te gustaría entender de {notebook.name}?</p>
            </div>
          )}
          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent className={m.role === "user" ? "chat-user" : ""}>
                <MessageResponse>{m.text}</MessageResponse>
              </MessageContent>
            </Message>
          ))}
          {thinking && <Shimmer>Milo está pensando…</Shimmer>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <PromptInput
        onSubmit={async ({ text }) => {
          if (!text.trim() || thinking) return;
          const withUser = [...messages, { id: crypto.randomUUID(), role: "user" as const, text }];
          push(withUser);
          setThinking(true);
          await new Promise((r) => setTimeout(r, 700));
          push([
            ...withUser,
            { id: crypto.randomUUID(), role: "assistant", text: mockReply(text, notebook) },
          ]);
          setThinking(false);
        }}
      >
        <PromptInputTextarea autoFocus placeholder="Escribe tu duda de estudio…" aria-label="Pregunta a Milo" />
        <PromptInputFooter className="justify-end">
          <PromptInputSubmit aria-label="Enviar pregunta" status={thinking ? "submitted" : "ready"} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
