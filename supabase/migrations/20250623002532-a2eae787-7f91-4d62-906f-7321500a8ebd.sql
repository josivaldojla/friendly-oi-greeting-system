
-- Habilitar RLS nas tabelas principais se ainda não estiver habilitado
ALTER TABLE public.completed_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mechanics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;

-- Aplicar políticas RLS para todas as tabelas principais
-- Políticas para customers
DROP POLICY IF EXISTS "Users can view and manage their own customers" ON public.customers;
CREATE POLICY "Users can view and manage their own customers" 
  ON public.customers 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = created_by
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = created_by
    END
  );

-- Políticas para mechanics
DROP POLICY IF EXISTS "Users can view and manage their own mechanics" ON public.mechanics;
CREATE POLICY "Users can view and manage their own mechanics" 
  ON public.mechanics 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = created_by
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = created_by
    END
  );

-- Políticas para services
DROP POLICY IF EXISTS "Users can view and manage their own services" ON public.services;
CREATE POLICY "Users can view and manage their own services" 
  ON public.services 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = created_by
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = created_by
    END
  );

-- Políticas para service_records
DROP POLICY IF EXISTS "Users can view and manage their own service_records" ON public.service_records;
CREATE POLICY "Users can view and manage their own service_records" 
  ON public.service_records 
  FOR ALL 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = created_by
    END
  )
  WITH CHECK (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = created_by
    END
  );

-- Garantir que created_by seja obrigatório em todas as tabelas
ALTER TABLE public.customers ALTER COLUMN created_by SET NOT NULL;
ALTER TABLE public.mechanics ALTER COLUMN created_by SET NOT NULL;
ALTER TABLE public.services ALTER COLUMN created_by SET NOT NULL;
ALTER TABLE public.service_records ALTER COLUMN created_by SET NOT NULL;

-- Atualizar registros existentes sem created_by
UPDATE public.customers 
SET created_by = (
  SELECT ur.user_id 
  FROM public.user_roles ur 
  WHERE ur.role = 'admin' 
  ORDER BY ur.created_at ASC 
  LIMIT 1
) 
WHERE created_by IS NULL;

UPDATE public.mechanics 
SET created_by = (
  SELECT ur.user_id 
  FROM public.user_roles ur 
  WHERE ur.role = 'admin' 
  ORDER BY ur.created_at ASC 
  LIMIT 1
) 
WHERE created_by IS NULL;

UPDATE public.services 
SET created_by = (
  SELECT ur.user_id 
  FROM public.user_roles ur 
  WHERE ur.role = 'admin' 
  ORDER BY ur.created_at ASC 
  LIMIT 1
) 
WHERE created_by IS NULL;

UPDATE public.service_records 
SET created_by = (
  SELECT ur.user_id 
  FROM public.user_roles ur 
  WHERE ur.role = 'admin' 
  ORDER BY ur.created_at ASC 
  LIMIT 1
) 
WHERE created_by IS NULL;
