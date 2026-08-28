
ALTER TABLE public.games
  ADD COLUMN IF NOT EXISTS paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

-- anon/authenticated must never be able to flip `paid`
REVOKE UPDATE, DELETE ON public.games FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.force_unpaid_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF current_user <> 'service_role' THEN
    NEW.paid := false;
    NEW.paid_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS games_force_unpaid_on_insert ON public.games;
CREATE TRIGGER games_force_unpaid_on_insert
BEFORE INSERT ON public.games
FOR EACH ROW EXECUTE FUNCTION public.force_unpaid_on_insert();

CREATE TABLE IF NOT EXISTS public.game_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id text NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  edition text NOT NULL,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  environment text NOT NULL DEFAULT 'sandbox',
  square_order_id text,
  square_payment_link_id text,
  checkout_url text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS game_payments_game_id_idx ON public.game_payments(game_id);
CREATE UNIQUE INDEX IF NOT EXISTS game_payments_order_id_idx ON public.game_payments(square_order_id) WHERE square_order_id IS NOT NULL;

GRANT ALL ON public.game_payments TO service_role;
ALTER TABLE public.game_payments ENABLE ROW LEVEL SECURITY;
-- intentionally no policies: only the service role (payment verification) touches this table
