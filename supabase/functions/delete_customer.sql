
CREATE OR REPLACE FUNCTION public.delete_customer(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Criar a tabela se não existir
  PERFORM create_customers_table();
  
  DELETE FROM public.customers
  WHERE id = p_id;
END;
$$;
