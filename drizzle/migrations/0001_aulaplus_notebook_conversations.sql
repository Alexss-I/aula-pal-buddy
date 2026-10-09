CREATE TABLE public.aulaplus_conversations (user_id uuid NOT NULL, notebook_id text NOT NULL, messages jsonb NOT NULL DEFAULT '[]'::jsonb, PRIMARY KEY (user_id, notebook_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.aulaplus_conversations TO authenticated;
GRANT ALL ON public.aulaplus_conversations TO service_role;
ALTER TABLE public.aulaplus_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notebook conversations belong to their owner" ON public.aulaplus_conversations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);