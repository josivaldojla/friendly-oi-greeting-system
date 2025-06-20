
-- Primeiro, adicionar as colunas created_by nas tabelas
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.mechanics ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.service_history ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.service_records ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.completed_services ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Atualizar registros existentes para ter o created_by do primeiro admin (se houver)
UPDATE public.customers SET created_by = (
  SELECT ur.user_id FROM public.user_roles ur WHERE ur.role = 'admin' LIMIT 1
) WHERE created_by IS NULL;

UPDATE public.mechanics SET created_by = (
  SELECT ur.user_id FROM public.user_roles ur WHERE ur.role = 'admin' LIMIT 1
) WHERE created_by IS NULL;

UPDATE public.services SET created_by = (
  SELECT ur.user_id FROM public.user_roles ur WHERE ur.role = 'admin' LIMIT 1
) WHERE created_by IS NULL;

UPDATE public.service_history SET created_by = (
  SELECT ur.user_id FROM public.user_roles ur WHERE ur.role = 'admin' LIMIT 1
) WHERE created_by IS NULL;

UPDATE public.service_records SET created_by = (
  SELECT ur.user_id FROM public.user_roles ur WHERE ur.role = 'admin' LIMIT 1
) WHERE created_by IS NULL;

UPDATE public.completed_services SET created_by = (
  SELECT ur.user_id FROM public.user_roles ur WHERE ur.role = 'admin' LIMIT 1
) WHERE created_by IS NULL;

-- Agora atualizar as políticas RLS
-- Políticas para customers (clientes)
DROP POLICY IF EXISTS "Admins can manage all customers" ON public.customers;
DROP POLICY IF EXISTS "Users can view customers" ON public.customers;

CREATE POLICY "Users can manage their own customers" 
  ON public.customers 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = COALESCE(created_by, auth.uid())
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = COALESCE(created_by, auth.uid())
    END
  );

-- Políticas para mechanics (mecânicos)
DROP POLICY IF EXISTS "Admins can manage all mechanics" ON public.mechanics;

CREATE POLICY "Users can manage their own mechanics" 
  ON public.mechanics 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = COALESCE(created_by, auth.uid())
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = COALESCE(created_by, auth.uid())
    END
  );

-- Políticas para services (serviços)
DROP POLICY IF EXISTS "Admins can manage all services" ON public.services;
DROP POLICY IF EXISTS "Users can view services" ON public.services;

CREATE POLICY "Users can manage their own services" 
  ON public.services 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = COALESCE(created_by, auth.uid())
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = COALESCE(created_by, auth.uid())
    END
  );

-- Políticas para service_history (histórico de serviços)
DROP POLICY IF EXISTS "Admins can manage all service history" ON public.service_history;

CREATE POLICY "Users can manage their own service history" 
  ON public.service_history 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = COALESCE(created_by, auth.uid())
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = COALESCE(created_by, auth.uid())
    END
  );

-- Políticas para service_records (registros de serviços)
DROP POLICY IF EXISTS "Admins can manage all service records" ON public.service_records;

CREATE POLICY "Users can manage their own service records" 
  ON public.service_records 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = COALESCE(created_by, auth.uid())
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = COALESCE(created_by, auth.uid())
    END
  );

-- Políticas para service_photos (fotos de serviços)
DROP POLICY IF EXISTS "Admins can manage all service photos" ON public.service_photos;

CREATE POLICY "Users can manage their own service photos" 
  ON public.service_photos 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE EXISTS (
        SELECT 1 FROM public.service_records sr 
        WHERE sr.id = service_record_id 
        AND auth.uid() = COALESCE(sr.created_by, auth.uid())
      )
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE EXISTS (
        SELECT 1 FROM public.service_records sr 
        WHERE sr.id = service_record_id 
        AND auth.uid() = COALESCE(sr.created_by, auth.uid())
      )
    END
  );

-- Políticas para completed_services (serviços concluídos)
DROP POLICY IF EXISTS "Admins can manage all completed services" ON public.completed_services;

CREATE POLICY "Users can manage their own completed services" 
  ON public.completed_services 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = COALESCE(created_by, auth.uid())
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = COALESCE(created_by, auth.uid())
    END
  );
