
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Heleno Motos</h1>
          <p className="text-gray-600 mb-8">Sistema de Gerenciamento de Oficina</p>
          <Link to="/auth">
            <Button size="lg">Fazer Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
          <div className="w-full max-w-xl">
            <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Heleno Motos</h1>
            <div className="mb-8">
              <h2 className="text-gray-600 text-lg">
                Você está logado como usuário
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Entre em contato com o administrador para obter acesso completo ao sistema.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
        <div className="w-full max-w-xl">
          <h1 className="text-3xl font-bold mb-4">Heleno Motos</h1>
          <div className="mb-8">
            <h2 className="text-gray-600 text-lg">
              Sistema completo para gerenciamento de serviços de oficina de motos
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4 w-full">
<<<<<<< HEAD
            <Link to="/login" className="w-full">
              <Button className="w-full h-16 text-lg bg-blue-600 hover:bg-blue-700 text-white">
                Fazer Login
=======
            <Link to="/admin" className="w-full">
              <Button className="w-full h-16 text-lg bg-red-600 hover:bg-red-700 text-white">
                🛡️ Administração
>>>>>>> a586c736e7004b2e486380ac59633982c01946ea
              </Button>
            </Link>
            
            <Link to="/mechanics" className="w-full">
              <Button className="w-full h-16 text-lg" variant="outline">
                Mecânicos
              </Button>
            </Link>
            
            <Link to="/services" className="w-full">
              <Button className="w-full h-16 text-lg" variant="outline">
                Serviços
              </Button>
            </Link>
            
            <Link to="/checkout" className="w-full">
              <Button className="w-full h-16 text-lg bg-moto-blue hover:bg-moto-lightblue">
                Caixa
              </Button>
            </Link>
            
            <Link to="/service-records" className="w-full">
              <Button className="w-full h-16 text-lg bg-green-600 hover:bg-green-700 text-white">
                Registro de Serviços
              </Button>
            </Link>
            
            <Link to="/reports" className="w-full">
              <Button className="w-full h-16 text-lg" variant="outline">
                Relatórios
              </Button>
            </Link>
            
            <Link to="/customers" className="w-full">
              <Button className="w-full h-16 text-lg" variant="outline">
                Clientes
              </Button>
            </Link>
            
            <Link to="/motorcycle-models" className="w-full">
              <Button className="w-full h-16 text-lg" variant="outline">
                Modelos de Motos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
