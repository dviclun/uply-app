-- ============================================================
-- BALANCE ADJUSTMENTS
-- ============================================================

CREATE TABLE public.balance_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX balance_adjustments_user_created_at_idx
  ON public.balance_adjustments(user_id, created_at DESC);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.balance_adjustments ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- BALANCE ADJUSTMENTS POLICIES
-- ============================================================

CREATE POLICY "Users can view their own balance adjustments"
  ON public.balance_adjustments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own balance adjustments"
  ON public.balance_adjustments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- MIGRATE EXISTING PROFILES
-- ============================================================

INSERT INTO public.balance_adjustments (
  user_id,
  amount,
  created_at
)
SELECT
  id,
  initial_balance,
  created_at
FROM public.profiles;


-- ============================================================
-- NEW USER TRIGGER
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
    last_name,
    initial_balance
  )
  VALUES (
    NEW.id,
    TRIM(NEW.raw_user_meta_data ->> 'username'),
    TRIM(NEW.raw_user_meta_data ->> 'first_name'),
    TRIM(NEW.raw_user_meta_data ->> 'last_name'),
    initial_balance_value
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