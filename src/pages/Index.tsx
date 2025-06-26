
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, isAdmin, loading } = useAuth();

  console.log("Index page rendering - User:", user, "Loading:", loading, "IsAdmin:", isAdmin);

  // Renderizar conteúdo mesmo durante loading para evitar tela em branco
  const renderContent = () => {
    if (loading) {
      console.log("Index: Mostrando estado de loading");
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-blue-600">Heleno Motos</h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando aplicação...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      console.log("Index: Usuário não autenticado, mostrando tela de login");
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-blue-600">Heleno Motos</h1>
            <p className="text-gray-600 mb-8 text-lg">Sistema de Gerenciamento de Oficina</p>
            <div className="space-y-4">
              <Link to="/auth" className="w-full">
                <Button size="lg" className="w-full">Fazer Login</Button>
              </Link>
              <p className="text-sm text-gray-500">
                Faça login para acessar o sistema
              </p>
            </div>
          </div>
        </div>
      );
    }

    console.log("Index: Usuário autenticado, mostrando app principal");
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
          <div className="w-full max-w-xl">
            <h1 className="text-4xl font-bold mb-6 text-blue-600">Heleno Motos</h1>
            <div className="mb-8">
              <h2 className="text-gray-600 text-xl mb-4">
                Sistema completo para gerenciamento de serviços de oficina de motos
              </h2>
              {!isAdmin && (
                <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                  Você está usando sua área pessoal. Todos os dados são privados e isolados.
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {isAdmin && (
                <Link to="/admin" className="w-full">
                  <Button className="w-full h-16 text-lg bg-red-600 hover:bg-red-700 text-white">
                    🛡️ Administração
                  </Button>
                </Link>
              )}
              
              <Link to="/mechanics" className="w-full">
                <Button className="w-full h-16 text-lg" variant="outline">
                  👨‍🔧 Mecânicos
                </Button>
              </Link>
              
              <Link to="/services" className="w-full">
                <Button className="w-full h-16 text-lg" variant="outline">
                  🔧 Serviços
                </Button>
              </Link>
              
              <Link to="/checkout" className="w-full">
                <Button className="w-full h-16 text-lg bg-blue-600 hover:bg-blue-700 text-white">
                  💰 Caixa
                </Button>
              </Link>
              
              <Link to="/service-records" className="w-full">
                <Button className="w-full h-16 text-lg bg-yellow-500 hover:bg-yellow-600 text-white">
                  📋 Registro de Serviços
                </Button>
              </Link>
              
              <Link to="/reports" className="w-full">
                <Button className="w-full h-16 text-lg bg-green-600 hover:bg-green-700 text-white">
                  📊 Relatórios
                </Button>
              </Link>
              
              <Link to="/customers" className="w-full">
                <Button className="w-full h-16 text-lg" variant="outline">
                  👥 Clientes
                </Button>
              </Link>
              
              <Link to="/motorcycle-models" className="w-full">
                <Button className="w-full h-16 text-lg" variant="outline">
                  🏍️ Modelos de Motos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  };

  return renderContent();
};

export default Index;
