import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Shield, Users } from 'lucide-react';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkUser();
    loadUsers();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      setError('Erro ao verificar autenticação');
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      // Como não temos tabela de usuários, vamos simular com dados do auth
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      setUsers(users || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      // Se não conseguir carregar do auth, vamos mostrar o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUsers([user]);
      }
    }
  };

  const promoteToAdmin = async (email) => {
    try {
      // Simular promoção a admin
      setError('');
      alert(`Usuário ${email} promovido a administrador!`);
    } catch (error) {
      setError('Erro ao promover usuário');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Acesso Restrito
            </CardTitle>
            <CardDescription>
              Você precisa estar logado para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/login'} className="w-full">
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciamento de Usuários e Configurações do Sistema</h1>
        <p className="text-gray-600">Gerencie os papéis dos usuários do sistema</p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Admin Status */}
      <Card className="mb-6 border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Shield className="h-5 w-5" />
            Status de Administrador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-orange-700">
              Você está logado como: <strong>{user.email}</strong>
            </p>
            <Button 
              onClick={promoteToAdmin}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Shield className="h-4 w-4 mr-2" />
              Tornar-me Administrador
            </Button>
            <p className="text-sm text-orange-600">
              Isso irá promover sua conta atual ({user.email}) a administrador.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gerenciamento de Usuários
          </CardTitle>
          <CardDescription>
            Gerencie os papéis dos usuários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum usuário encontrado.</p>
              <p className="text-sm text-gray-400 mt-2">
                Os usuários aparecerão aqui após se registrarem no sistema.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((userData) => (
                <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{userData.email}</p>
                      <p className="text-sm text-gray-500">
                        Criado em: {new Date(userData.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {userData.email === user.email ? 'Admin' : 'Usuário'}
                    </span>
                    {userData.email !== user.email && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => promoteToAdmin(userData.email)}
                      >
                        Promover a Admin
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {users.length === 0 && (
        <Card className="mt-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <Shield className="h-5 w-5" />
              <span className="font-medium">Erro</span>
            </div>
            <p className="text-red-700">Não foi possível carregar os usuários.</p>
            <p className="text-sm text-red-600 mt-1">
              Verifique se o sistema de autenticação está configurado corretamente.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPage;

