
-- Criar enum para os papéis de usuário
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Criar tabela de perfis dos usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Criar tabela de papéis dos usuários
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função para verificar se um usuário tem um papel específico
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Função para obter o papel do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles" 
  ON public.profiles 
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para user_roles
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" 
  ON public.user_roles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Adicionar papel de usuário por padrão
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Habilitar RLS em todas as tabelas existentes
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motorcycle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_photos ENABLE ROW LEVEL SECURITY;

-- Políticas para customers
CREATE POLICY "Admins can manage all customers" 
  ON public.customers 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para motorcycle_models
CREATE POLICY "Admins can manage all motorcycle models" 
  ON public.motorcycle_models 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view motorcycle models" 
  ON public.motorcycle_models 
  FOR SELECT 
  TO authenticated;

-- Políticas para service_history
CREATE POLICY "Admins can manage all service history" 
  ON public.service_history 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para service_records
CREATE POLICY "Admins can manage all service records" 
  ON public.service_records 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para service_photos
CREATE POLICY "Admins can manage all service photos" 
  ON public.service_photos 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Remover políticas muito permissivas existentes
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.completed_services;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.mechanics;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.services;

-- Políticas para completed_services
CREATE POLICY "Admins can manage all completed services" 
  ON public.completed_services 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para mechanics
CREATE POLICY "Admins can manage all mechanics" 
  ON public.mechanics 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para services
CREATE POLICY "Admins can manage all services" 
  ON public.services 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view services" 
  ON public.services 
  FOR SELECT 
  TO authenticated;
