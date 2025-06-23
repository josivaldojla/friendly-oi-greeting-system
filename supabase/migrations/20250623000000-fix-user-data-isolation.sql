
-- Corrigir isolamento de dados por usuário
-- Garantir que usuários comuns só vejam seus próprios dados

-- Atualizar políticas para completed_services (relatórios)
DROP POLICY IF EXISTS "Users can manage their own completed services" ON public.completed_services;

CREATE POLICY "Users can view and manage their own completed services" 
  ON public.completed_services 
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

-- Garantir que created_by seja sempre preenchido
ALTER TABLE public.completed_services ALTER COLUMN created_by SET NOT NULL;

-- Atualizar registros sem created_by para o primeiro admin
UPDATE public.completed_services 
SET created_by = (
  SELECT ur.user_id 
  FROM public.user_roles ur 
  WHERE ur.role = 'admin' 
  ORDER BY ur.created_at ASC 
  LIMIT 1
) 
WHERE created_by IS NULL;

-- Função para garantir que created_by seja sempre definido
CREATE OR REPLACE FUNCTION public.set_created_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para definir created_by automaticamente
DROP TRIGGER IF EXISTS set_created_by_trigger ON public.completed_services;
CREATE TRIGGER set_created_by_trigger
  BEFORE INSERT ON public.completed_services
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

-- Aplicar o mesmo padrão para outras tabelas importantes
DROP TRIGGER IF EXISTS set_created_by_customers ON public.customers;
CREATE TRIGGER set_created_by_customers
  BEFORE INSERT ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

DROP TRIGGER IF EXISTS set_created_by_mechanics ON public.mechanics;
CREATE TRIGGER set_created_by_mechanics
  BEFORE INSERT ON public.mechanics
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

DROP TRIGGER IF EXISTS set_created_by_services ON public.services;
CREATE TRIGGER set_created_by_services
  BEFORE INSERT ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

DROP TRIGGER IF EXISTS set_created_by_service_records ON public.service_records;
CREATE TRIGGER set_created_by_service_records
  BEFORE INSERT ON public.service_records
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();
