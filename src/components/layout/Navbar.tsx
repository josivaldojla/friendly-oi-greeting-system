
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-black text-white shadow-md fixed top-0 left-0 right-0 z-50 h-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-full">
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <img 
              src="/lovable-uploads/97ddb309-4ef6-4b93-bcdb-a39227bd5388.png"
              alt="Heleno Motos"
              className="w-3/4 h-full object-cover opacity-50"
              style={{ 
                maxHeight: '3.5rem', 
                filter: 'brightness(2)' 
              }}
            />
          </div>
          
          <Link to="/" className="absolute inset-0 w-full h-full z-[5]">
            <span className="sr-only">Ir para página inicial</span>
          </Link>
          
          {/* User menu */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
            <UserMenu />
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center relative z-10">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-black focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Menu principal"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          {/* Desktop navigation - Show for all authenticated users */}
          <div className="hidden md:flex md:items-center md:space-x-4 relative z-10 ml-auto mr-12">
            <NavLinks isAdmin={isAdmin} />
          </div>
        </div>
        
        {/* Mobile Navigation Menu - Show for all authenticated users */}
        {isMenuOpen && (
          <div className="md:hidden bg-black pt-2 pb-3 space-y-1 relative z-20 border-t border-gray-700">
            {isAdmin && (
              <Link to="/admin" className="block px-4 py-3 rounded-md text-white hover:bg-gray-800">
                <div className="flex items-center">
                  <span className="text-base">Administração</span>
                </div>
              </Link>
            )}
            <Link to="/mechanics" className="block px-4 py-3 rounded-md text-white hover:bg-gray-800">
              <div className="flex items-center">
                <span className="text-base">Mecânicos</span>
              </div>
            </Link>
            <Link to="/services" className="block px-4 py-3 rounded-md text-white hover:bg-gray-800">
              <div className="flex items-center">
                <span className="text-base">Serviços</span>
              </div>
            </Link>
            <Link to="/checkout" className="block px-4 py-3 rounded-md text-white hover:bg-gray-800">
              <div className="flex items-center">
                <span className="text-base">Caixa</span>
              </div>
            </Link>
            <Link to="/service-records" className="block px-4 py-3 rounded-md text-white hover:bg-gray-800">
              <div className="flex items-center">
                <span className="text-base">Registro de Serviços</span>
              </div>
            </Link>
            <Link to="/reports" className="block px-4 py-3 rounded-md text-white hover:bg-gray-800">
              <div className="flex items-center">
                <span className="text-base">Relatórios</span>
              </div>
            </Link>
            <Link to="/customers" className="block px-4 py-3 rounded-md text-white hover:bg-gray-800">
              <div className="flex items-center">
                <span className="text-base">Clientes</span>
              </div>
            </Link>
            <Link to="/motorcycle-models" className="block px-4 py-3 rounded-md text-white hover:bg-gray-800">
              <div className="flex items-center">
                <span className="text-base">Modelos de Motos</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLinks = ({ isAdmin }: { isAdmin: boolean }) => (
  <>
    {isAdmin && (
      <Link to="/admin">
        <Button variant="ghost" className="text-white hover:bg-black hover:text-gray-300">
          Admin
        </Button>
      </Link>
    )}
    <Link to="/mechanics">
      <Button variant="ghost" className="text-white hover:bg-black hover:text-gray-300">
        Mecânicos
      </Button>
    </Link>
    <Link to="/services">
      <Button variant="ghost" className="text-white hover:bg-black hover:text-gray-300">
        Serviços
      </Button>
    </Link>
    <Link to="/checkout">
      <Button variant="ghost" className="text-white hover:bg-black hover:text-gray-300">
        Caixa
      </Button>
    </Link>
    <Link to="/service-records">
      <Button variant="ghost" className="text-white hover:bg-black hover:text-gray-300">
        Registros
      </Button>
    </Link>
    <Link to="/reports">
      <Button variant="ghost" className="text-white hover:bg-black hover:text-gray-300">
        Relatórios
      </Button>
    </Link>
    <Link to="/customers">
      <Button variant="ghost" className="text-white hover:bg-black hover:text-gray-300">
        Clientes
      </Button>
    </Link>
    <Link to="/motorcycle-models">
      <Button variant="ghost" className="text-white hover:bg-black hover:text-gray-300">
        Modelos de Motos
      </Button>
    </Link>
  </>
);

export default Navbar;
