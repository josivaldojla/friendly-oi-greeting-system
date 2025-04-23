
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div className="mb-8">
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
      </div>
    </Layout>
  );
};

export default Index;
