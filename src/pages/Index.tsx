
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const Index = () => {
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
            <Link to="/mechanics" className="w-full">
              <Button className="w-full h-16 text-lg" variant="outline">
                Mecânicosfgg
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
