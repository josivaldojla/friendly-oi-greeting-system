
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <nav className="bg-black text-white shadow-md relative h-16">
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
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4 relative z-10 ml-auto">
            <NavLinks />
          </div>
        </div>
        
        {/* Mobile Navigation Menu - Improved for better touch targets */}
        {isMenuOpen && (
          <div className="md:hidden bg-black pt-2 pb-3 space-y-1 relative z-20 border-t border-gray-700">
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
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLinks = () => (
  <>
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
  </>
);

export default Navbar;
