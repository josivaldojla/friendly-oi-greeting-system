
CREATE OR REPLACE FUNCTION public.create_customers_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.customers (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    phone text,
    email text,
    address text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
  );

  -- Adicionar política RLS
  ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Enable full access to all users" ON public.customers USING (true) WITH CHECK (true);
END;
$$;
