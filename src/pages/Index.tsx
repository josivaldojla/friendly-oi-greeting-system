
import { Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div className="mb-8">
          <Wrench className="h-20 w-20 text-moto-blue mx-auto" />
          <h1 className="text-4xl font-bold mt-4 mb-2">Serviços Heleno Motos</h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto mb-8">
            Sistema completo para gerenciamento de serviços de oficina de motos
          </p>
          
          <div className="relative w-full max-w-2xl mx-auto mb-12">
            <img 
              src="/lovable-uploads/5b79759b-0ed0-4018-8ab7-a72d45892185.png"
              alt="Equipe Heleno Motos"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
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
            <Button className="w-full h-16 text-lg" variant="default">
              Caixa
            </Button>
          </Link>
          
          <Link to="/reports" className="w-full">
            <Button className="w-full h-16 text-lg" variant="outline">
              Relatórios
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
