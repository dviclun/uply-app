-- ============================================================
-- REMOVE INITIAL BALANCE FROM PROFILES
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  initial_balance_value NUMERIC;
BEGIN
  IF
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'username'), '') IS NULL OR
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'first_name'), '') IS NULL OR
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'last_name'), '') IS NULL
  THEN
    RAISE EXCEPTION 'Missing required profile data';
  END IF;

  initial_balance_value := COALESCE(
    (NEW.raw_user_meta_data ->> 'initial_balance')::numeric,
    0
  );

  INSERT INTO public.profiles (
    id,
    username,
    first_name,
    last_name
  )
  VALUES (
    NEW.id,
    TRIM(NEW.raw_user_meta_data ->> 'username'),
    TRIM(NEW.raw_user_meta_data ->> 'first_name'),
    TRIM(NEW.raw_user_meta_data ->> 'last_name')
  );

  INSERT INTO public.balance_adjustments (
    user_id,
    amount
  )
  VALUES (
    NEW.id,
    initial_balance_value
  );

  RETURN NEW;
END;
$$;

ALTER TABLE public.profiles
DROP COLUMN initial_balance;