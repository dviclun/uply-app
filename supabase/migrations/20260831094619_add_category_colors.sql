ALTER TABLE public.categories
ADD COLUMN color TEXT NOT NULL DEFAULT '#E2E8F0';

UPDATE public.categories
SET color = CASE
  WHEN name = 'Alimentación' AND type = 'expense' THEN '#DCFCE7'
  WHEN name = 'Vivienda' AND type = 'expense' THEN '#EDE9FE'
  WHEN name = 'Transporte' AND type = 'expense' THEN '#DBEAFE'
  WHEN name = 'Ocio' AND type = 'expense' THEN '#FCE7F3'
  WHEN name = 'Compras' AND type = 'expense' THEN '#FEF3C7'
  WHEN name = 'Salud' AND type = 'expense' THEN '#FEE2E2'
  WHEN name = 'Educación' AND type = 'expense' THEN '#E0E7FF'
  WHEN name = 'Suscripciones' AND type = 'expense' THEN '#F3E8FF'
  WHEN name = 'Otros' AND type = 'expense' THEN '#E2E8F0'

  WHEN name = 'Nómina' AND type = 'income' THEN '#DCFCE7'
  WHEN name = 'Freelance' AND type = 'income' THEN '#CCFBF1'
  WHEN name = 'Inversiones' AND type = 'income' THEN '#D1FAE5'
  WHEN name = 'Otros' AND type = 'income' THEN '#E2E8F0'

  ELSE color
END;