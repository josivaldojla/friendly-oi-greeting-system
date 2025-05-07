
CREATE OR REPLACE FUNCTION public.update_customer(
  p_id uuid,
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
  
  UPDATE public.customers
  SET 
    name = p_name,
    phone = p_phone,
    email = p_email,
    address = p_address,
    updated_at = now()
  WHERE id = p_id;
END;
$$;
