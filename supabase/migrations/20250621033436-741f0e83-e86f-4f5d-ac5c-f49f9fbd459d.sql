
-- Adicionar colunas para soft delete na tabela services
ALTER TABLE public.services 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN deleted_by UUID;

-- Adicionar comentários para documentar as colunas
COMMENT ON COLUMN public.services.deleted_at IS 'Timestamp when the service was soft deleted by a user';
COMMENT ON COLUMN public.services.deleted_by IS 'ID of the user who soft deleted this service';
