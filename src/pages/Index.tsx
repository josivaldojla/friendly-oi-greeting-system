
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, isAdmin, loading } = useAuth();

  console.log("Index page rendering - User:", user, "Loading:", loading, "IsAdmin:", isAdmin);

  if (loading) {
    console.log("Index: Showing loading state");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Heleno Motos</h1>
          <p className="text-gray-600 mb-8">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("Index: No user, showing login screen");
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

  console.log("Index: User authenticated, showing main app");
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
        <div className="w-full max-w-xl">
          <h1 className="text-3xl font-bold mb-4">Heleno Motos</h1>
          <div className="mb-8">
            <h2 className="text-gray-600 text-lg">
              Sistema completo para gerenciamento de serviços de oficina de motos
            </h2>
            {!isAdmin && (
              <p className="text-sm text-blue-600 mt-2">
                Você está usando sua área pessoal. Todos os dados são privados e isolados.
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4 w-full">
            {isAdmin && (
              <Link to="/admin" className="w-full">
                <Button className="w-full h-16 text-lg bg-red-600 hover:bg-red-700 text-white">
                  🛡️ Administração
                </Button>
              </Link>
            )}
            
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
              <Button className="w-full h-16 text-lg bg-yellow-500 hover:bg-yellow-600 text-white">
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
