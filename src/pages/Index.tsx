
import { Wrench, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { toast } from "sonner";

const Index = () => {
  const [imageUrl, setImageUrl] = useState("/lovable-uploads/5b79759b-0ed0-4018-8ab7-a72d45892185.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string;
        setImageUrl(newImageUrl);
        toast.success("Imagem atualizada com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div className="mb-8">
          <Wrench className="h-20 w-20 text-moto-blue mx-auto" />
          <h1 className="text-4xl font-bold mt-4 mb-2">Serviços Heleno Motos</h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto mb-8">
            Sistema completo para gerenciamento de serviços de oficina de motos
          </p>
          
          <div className="relative w-full max-w-2xl mx-auto mb-12 group">
            <img 
              src={imageUrl}
              alt="Equipe Heleno Motos"
              className="rounded-lg shadow-lg w-full"
            />
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Atualizar Imagem</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    Escolher Nova Imagem
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
