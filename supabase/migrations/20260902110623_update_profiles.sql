-- ============================================================
-- PROFILE FIELDS
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN username TEXT NOT NULL,
  ADD COLUMN first_name TEXT NOT NULL,
  ADD COLUMN last_name TEXT NOT NULL;


-- ============================================================
-- USERNAME UNIQUE INDEX
-- ============================================================

CREATE UNIQUE INDEX profiles_username_unique_idx
  ON public.profiles (LOWER(username));


-- ============================================================
-- NEW USER TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    first_name,
    last_name,
    initial_balance
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE(
      (NEW.raw_user_meta_data ->> 'initial_balance')::numeric,
      0
    )
  );

  RETURN NEW;
END;
$$;


-- ============================================================
-- USERNAME AVAILABILITY
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_username_available(
  requested_username TEXT
)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE LOWER(username) = LOWER(requested_username)
  );
$$;

GRANT EXECUTE
ON FUNCTION public.is_username_available(TEXT)
TO anon, authenticated;