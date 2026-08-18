-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE public.transaction_type AS ENUM (
  'income',
  'expense'
);

CREATE TYPE public.savings_goal_status AS ENUM (
  'active',
  'pending',
  'completed',
  'failed',
  'not_activated'
);


-- ============================================================
-- PROFILES
-- ============================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  initial_balance NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- TRANSACTIONS
-- ============================================================

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  type public.transaction_type NOT NULL,
  date TIMESTAMPTZ NOT NULL
);


-- ============================================================
-- SAVINGS GOALS
-- ============================================================

CREATE TABLE public.savings_goals (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period TEXT NOT NULL,
  target NUMERIC NOT NULL CHECK (target > 0),
  status public.savings_goal_status NOT NULL,

  CONSTRAINT savings_goals_user_period_unique
    UNIQUE (user_id, period)
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX transactions_user_id_idx
  ON public.transactions(user_id);

CREATE INDEX transactions_user_date_idx
  ON public.transactions(user_id, date);

CREATE INDEX savings_goals_user_id_idx
  ON public.savings_goals(user_id);

CREATE INDEX savings_goals_user_period_idx
  ON public.savings_goals(user_id, period);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- PROFILES POLICIES
-- ============================================================

CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ============================================================
-- TRANSACTIONS POLICIES
-- ============================================================

CREATE POLICY "Users can view their own transactions"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON public.transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON public.transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON public.transactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- SAVINGS GOALS POLICIES
-- ============================================================

CREATE POLICY "Users can view their own savings goals"
  ON public.savings_goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own savings goals"
  ON public.savings_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own savings goals"
  ON public.savings_goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own savings goals"
  ON public.savings_goals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);