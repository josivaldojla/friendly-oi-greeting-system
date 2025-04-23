
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-moto-blue text-white shadow-md relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="absolute inset-0 w-full h-16">
            <img 
              src="/lovable-uploads/97ddb309-4ef6-4b93-bcdb-a39227bd5388.png"
              alt="Heleno Motos"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          
          <Link to="/" className="absolute inset-0 w-full h-full z-[5]">
            <span className="sr-only">Ir para página inicial</span>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center relative z-10">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-moto-lightblue focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4 relative z-10 ml-auto">
            <NavLinks />
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-moto-blue pt-2 pb-3 space-y-1 relative z-10">
            <Link to="/mechanics" className="block px-3 py-2 rounded-md text-white hover:bg-moto-lightblue">
              <div className="flex items-center">
                <span>Mecânicos</span>
              </div>
            </Link>
            <Link to="/services" className="block px-3 py-2 rounded-md text-white hover:bg-moto-lightblue">
              <div className="flex items-center">
                <span>Serviços</span>
              </div>
            </Link>
            <Link to="/checkout" className="block px-3 py-2 rounded-md text-white hover:bg-moto-lightblue">
              <div className="flex items-center">
                <span>Caixa</span>
              </div>
            </Link>
            <Link to="/reports" className="block px-3 py-2 rounded-md text-white hover:bg-moto-lightblue">
              <div className="flex items-center">
                <span>Relatórios</span>
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
      <Button variant="ghost" className="text-white hover:bg-moto-lightblue">
        Mecânicos
      </Button>
    </Link>
    <Link to="/services">
      <Button variant="ghost" className="text-white hover:bg-moto-lightblue">
        Serviços
      </Button>
    </Link>
    <Link to="/checkout">
      <Button variant="ghost" className="text-white hover:bg-moto-lightblue">
        Caixa
      </Button>
    </Link>
    <Link to="/reports">
      <Button variant="ghost" className="text-white hover:bg-moto-lightblue">
        Relatórios
      </Button>
    </Link>
  </>
);

export default Navbar;
