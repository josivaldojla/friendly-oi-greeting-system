
CREATE OR REPLACE FUNCTION public.get_all_customers()
RETURNS TABLE (
  id uuid,
  name text,
  phone text,
  email text,
  address text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Criar a tabela se não existir
  PERFORM create_customers_table();
  
  RETURN QUERY
    SELECT c.id, c.name, c.phone, c.email, c.address, c.created_at, c.updated_at
    FROM public.customers c
    ORDER BY c.name ASC;
END;
$$;
