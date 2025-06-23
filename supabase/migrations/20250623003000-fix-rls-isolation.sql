
-- Corrigir políticas RLS para isolamento correto de dados
-- Garantir que usuários comuns vejam apenas seus próprios dados

-- Recriar políticas para services
DROP POLICY IF EXISTS "Users can view and manage their own services" ON public.services;
CREATE POLICY "Users can view and manage their own services" 
  ON public.services 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE created_by = auth.uid()
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE created_by = auth.uid()
    END
  );

-- Recriar políticas para customers
DROP POLICY IF EXISTS "Users can view and manage their own customers" ON public.customers;
CREATE POLICY "Users can view and manage their own customers" 
  ON public.customers 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE created_by = auth.uid()
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE created_by = auth.uid()
    END
  );

-- Recriar políticas para mechanics
DROP POLICY IF EXISTS "Users can view and manage their own mechanics" ON public.mechanics;
CREATE POLICY "Users can view and manage their own mechanics" 
  ON public.mechanics 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE created_by = auth.uid()
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE created_by = auth.uid()
    END
  );

-- Recriar políticas para service_records
DROP POLICY IF EXISTS "Users can view and manage their own service_records" ON public.service_records;
CREATE POLICY "Users can view and manage their own service_records" 
  ON public.service_records 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE created_by = auth.uid()
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE created_by = auth.uid()
    END
  );

-- Recriar políticas para completed_services (relatórios)
DROP POLICY IF EXISTS "Users can view and manage their own completed services" ON public.completed_services;
CREATE POLICY "Users can view and manage their own completed services" 
  ON public.completed_services 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE created_by = auth.uid()
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE created_by = auth.uid()
    END
  );
