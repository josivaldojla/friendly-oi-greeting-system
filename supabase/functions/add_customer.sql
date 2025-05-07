
CREATE OR REPLACE FUNCTION public.add_customer(
  p_name text,
  p_phone text,
  p_email text,
  p_address text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Criar a tabela se não existir
  PERFORM create_customers_table();
  
  INSERT INTO public.customers (name, phone, email, address)
  VALUES (p_name, p_phone, p_email, p_address);
END;
$$;
