
CREATE OR REPLACE FUNCTION public.force_unpaid_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
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

REVOKE EXECUTE ON FUNCTION public.force_unpaid_on_insert() FROM public, anon, authenticated;
