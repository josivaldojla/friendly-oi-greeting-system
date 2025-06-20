
import Layout from "@/components/layout/Layout";
import UserManagement from "@/components/admin/UserManagement";
import { useAuth } from "@/contexts/AuthContext";

const AdminPage = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie usuários e configurações do sistema</p>
        </div>
        
        <UserManagement />
      </div>
    </Layout>
  );
};

export default AdminPage;
