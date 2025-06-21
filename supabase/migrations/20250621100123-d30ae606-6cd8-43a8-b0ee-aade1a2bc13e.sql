
-- Enable RLS on motorcycle_models table
ALTER TABLE public.motorcycle_models ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to view motorcycle models
CREATE POLICY "All users can view motorcycle models" 
  ON public.motorcycle_models 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create policy to allow all authenticated users to insert motorcycle models
CREATE POLICY "All users can insert motorcycle models" 
  ON public.motorcycle_models 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow all authenticated users to update motorcycle models
CREATE POLICY "All users can update motorcycle models" 
  ON public.motorcycle_models 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Create policy to allow all authenticated users to delete motorcycle models
CREATE POLICY "All users can delete motorcycle models" 
  ON public.motorcycle_models 
  FOR DELETE 
  TO authenticated
  USING (true);
