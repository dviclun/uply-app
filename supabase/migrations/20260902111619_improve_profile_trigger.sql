-- ============================================================
-- IMPROVE NEW USER TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'username'), '') IS NULL OR
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'first_name'), '') IS NULL OR
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'last_name'), '') IS NULL
  THEN
    RAISE EXCEPTION 'Missing required profile data';
  END IF;

  INSERT INTO public.profiles (
    id,
    username,
    first_name,
    last_name,
    initial_balance
  )
  VALUES (
    NEW.id,
    TRIM(NEW.raw_user_meta_data ->> 'username'),
    TRIM(NEW.raw_user_meta_data ->> 'first_name'),
    TRIM(NEW.raw_user_meta_data ->> 'last_name'),
    COALESCE(
      (NEW.raw_user_meta_data ->> 'initial_balance')::numeric,
      0
    )
  );

  RETURN NEW;
END;
$$;