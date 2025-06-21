
-- Add created_by column to motorcycle_models table
ALTER TABLE public.motorcycle_models ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Update existing records to have a created_by value (assign to first admin if exists, otherwise leave null)
UPDATE public.motorcycle_models SET created_by = (
  SELECT ur.user_id FROM public.user_roles ur WHERE ur.role = 'admin' LIMIT 1
) WHERE created_by IS NULL;

-- Drop existing policies
DROP POLICY IF EXISTS "All users can view motorcycle models" ON public.motorcycle_models;
DROP POLICY IF EXISTS "All users can insert motorcycle models" ON public.motorcycle_models;
DROP POLICY IF EXISTS "All users can update motorcycle models" ON public.motorcycle_models;
DROP POLICY IF EXISTS "All users can delete motorcycle models" ON public.motorcycle_models;

-- Create new policies that isolate data per user
CREATE POLICY "Users can view their own motorcycle models" 
  ON public.motorcycle_models 
  FOR SELECT 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = COALESCE(created_by, auth.uid())
    END
  );

CREATE POLICY "Users can insert their own motorcycle models" 
  ON public.motorcycle_models 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own motorcycle models" 
  ON public.motorcycle_models 
  FOR UPDATE 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = COALESCE(created_by, auth.uid())
    END
  );

CREATE POLICY "Users can delete their own motorcycle models" 
  ON public.motorcycle_models 
  FOR DELETE 
  TO authenticated
  USING (
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN true
      ELSE auth.uid() = COALESCE(created_by, auth.uid())
    END
  );
