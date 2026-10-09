CREATE TABLE public.aulaplus_workspaces (user_id uuid PRIMARY KEY, state jsonb NOT NULL DEFAULT '{}'::jsonb, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.aulaplus_workspaces TO authenticated;
GRANT ALL ON public.aulaplus_workspaces TO service_role;
ALTER TABLE public.aulaplus_workspaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners read their AulaPlus workspace" ON public.aulaplus_workspaces FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Owners create their AulaPlus workspace" ON public.aulaplus_workspaces FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners update their AulaPlus workspace" ON public.aulaplus_workspaces FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners delete their AulaPlus workspace" ON public.aulaplus_workspaces FOR DELETE TO authenticated USING (auth.uid() = user_id);