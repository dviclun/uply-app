-- ============================================================
-- CATEGORIES
-- ============================================================

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type public.transaction_type NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX categories_user_id_idx
  ON public.categories(user_id);

CREATE INDEX categories_type_idx
  ON public.categories(type);

-- ============================================================
-- TRANSACTIONS
-- ============================================================

ALTER TABLE public.transactions
ADD COLUMN category_id UUID
REFERENCES public.categories(id)
ON DELETE SET NULL;

CREATE INDEX transactions_category_id_idx
  ON public.transactions(category_id);

-- ============================================================
-- GLOBAL CATEGORIES
-- ============================================================

INSERT INTO public.categories (name, type, icon)
VALUES
  ('Alimentación', 'expense', 'utensils'),
  ('Vivienda', 'expense', 'house'),
  ('Transporte', 'expense', 'car'),
  ('Ocio', 'expense', 'gamepad'),
  ('Compras', 'expense', 'shopping-bag'),
  ('Salud', 'expense', 'heart-pulse'),
  ('Educación', 'expense', 'graduation-cap'),
  ('Suscripciones', 'expense', 'repeat'),
  ('Otros', 'expense', 'ellipsis'),

  ('Nómina', 'income', 'briefcase'),
  ('Freelance', 'income', 'laptop'),
  ('Inversiones', 'income', 'chart-line'),
  ('Otros', 'income', 'ellipsis');

CREATE UNIQUE INDEX categories_global_name_type_idx
  ON public.categories(name, type)
  WHERE user_id IS NULL;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view available categories"
  ON public.categories
  FOR SELECT
  TO authenticated
  USING (
    user_id IS NULL
    OR user_id = auth.uid()
  );