
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-moto-dark text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Moto Service Pre - Todos os direitos reservados</p>
        </div>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;
