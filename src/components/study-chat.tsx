import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
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
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Notebook } from "@/lib/aulaplus";
import mascot from "@/assets/mascot.png";
import { toast } from "sonner";

export function StudyChat({
  notebook,
  userId,
  signIn,
}: {
  notebook: Notebook;
  userId: string | null;
  signIn: () => Promise<void>;
}) {
  const [history, setHistory] = useState<UIMessage[] | null>(null);
  useEffect(() => {
    let active = true;
    if (!userId) {
      setHistory([]);
      return;
    }
    void supabase
      .from("aulaplus_conversations")
      .select("messages")
      .eq("user_id", userId)
      .eq("notebook_id", notebook.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) toast.error("No pudimos cargar la conversación.");
        setHistory((data?.messages as unknown as UIMessage[]) || []);
      });
    return () => {
      active = false;
    };
  }, [userId, notebook.id]);
  if (!userId)
    return (
      <div className="chat-panel">
        <div className="chat-empty">
          <img src={mascot} alt="Milo, tu compañero de estudio" width={1024} height={1024} />
          <h3>¡Hola! Soy Milo.</h3>
          <p className="text-muted-foreground text-sm mb-5">
            ¿Qué descubrimos hoy en {notebook.name}?
          </p>
          <Button onClick={() => void signIn()}>Entrar con Google para conversar</Button>
        </div>
      </div>
    );
  if (!history)
    return (
      <div className="chat-panel">
        <Shimmer>Cargando tu conversación…</Shimmer>
      </div>
    );
  return <ActiveChat key={`${notebook.id}-${userId}`} notebook={notebook} history={history} />;
}
function ActiveChat({ notebook, history }: { notebook: Notebook; history: UIMessage[] }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/study-chat",
        body: { notebookId: notebook.id, subject: notebook.name, notes: notebook.notes },
        headers: async () => {
          const { data } = await supabase.auth.getSession();
          return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
        },
      }),
    [notebook.id, notebook.name, notebook.notes],
  );
  const { messages, sendMessage, status, stop, error } = useChat({
    id: notebook.id,
    messages: history,
    transport,
    onError: (e) => toast.error(e.message),
  });
  useEffect(() => {
    if (status === "ready") ref.current?.focus();
  }, [status]);
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
                {m.parts.map((p, i) =>
                  p.type === "text" ? (
                    <MessageResponse key={i}>{p.text}</MessageResponse>
                  ) : p.type === "reasoning" ? (
                    <details key={i} className="text-xs text-muted-foreground">
                      <summary>Proceso de orientación</summary>
                      <MessageResponse>{p.text}</MessageResponse>
                    </details>
                  ) : null,
                )}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && <Shimmer>Milo está pensando…</Shimmer>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      {error && (
        <p className="chat-error" role="alert">
          {error.message}
        </p>
      )}
      <PromptInput
        onSubmit={async ({ text }) => {
          if (!text.trim() || status === "submitted" || status === "streaming") return;
          await sendMessage({ text });
          ref.current?.focus();
        }}
      >
        <PromptInputTextarea
          ref={ref}
          autoFocus
          placeholder="Escribe tu duda de estudio…"
          aria-label="Pregunta a Milo"
        />
        <PromptInputFooter className="justify-end">
          <PromptInputSubmit
            aria-label={status === "streaming" ? "Detener respuesta" : "Enviar pregunta"}
            status={status}
            onStop={() => void stop()}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
