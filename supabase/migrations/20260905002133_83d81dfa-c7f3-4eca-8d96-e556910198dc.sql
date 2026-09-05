DROP POLICY IF EXISTS "Anyone can create games" ON public.games;
DROP POLICY IF EXISTS "Anyone can view games" ON public.games;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games FORCE ROW LEVEL SECURITY;
ALTER TABLE public.game_payments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.games FROM anon, authenticated;
REVOKE ALL ON public.game_payments FROM anon, authenticated;
GRANT ALL ON public.games TO service_role;
GRANT ALL ON public.game_payments TO service_role;