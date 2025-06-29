
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow w-full px-0 sm:px-4 overflow-x-hidden pt-6 mt-4">
        <div className="container mx-auto w-full max-w-7xl px-0 sm:px-4">
          {children}
        </div>
      </main>
      <footer className="bg-moto-dark text-white py-4 px-4 text-center text-sm mt-8">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Serviços Heleno Motos - Todos os direitos reservados ao Josivaldo L. de Araujo</p>
        </div>
      </footer>
      <Toaster position={isMobile ? "bottom-center" : "top-right"} />
    </div>
  );
};

export default Layout;
