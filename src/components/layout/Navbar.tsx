
import { Link } from "react-router-dom";
import { Wrench, FileText, CreditCard, BarChart3, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-moto-blue text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Wrench className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">Serviços Heleno Motos</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-moto-lightblue focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLinks />
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-moto-blue pt-2 pb-3 space-y-1">
            <Link to="/mechanics" className="block px-3 py-2 rounded-md text-white hover:bg-moto-lightblue">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                <span>Mecânicos</span>
              </div>
            </Link>
            <Link to="/services" className="block px-3 py-2 rounded-md text-white hover:bg-moto-lightblue">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                <span>Serviços</span>
              </div>
            </Link>
            <Link to="/checkout" className="block px-3 py-2 rounded-md text-white hover:bg-moto-lightblue">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                <span>Caixa</span>
              </div>
            </Link>
            <Link to="/reports" className="block px-3 py-2 rounded-md text-white hover:bg-moto-lightblue">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
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
        <CreditCard className="h-5 w-5 mr-2" />
        Mecânicos
      </Button>
    </Link>
    <Link to="/services">
      <Button variant="ghost" className="text-white hover:bg-moto-lightblue">
        <FileText className="h-5 w-5 mr-2" />
        Serviços
      </Button>
    </Link>
    <Link to="/checkout">
      <Button variant="ghost" className="text-white hover:bg-moto-lightblue">
        <CreditCard className="h-5 w-5 mr-2" />
        Caixa
      </Button>
    </Link>
    <Link to="/reports">
      <Button variant="ghost" className="text-white hover:bg-moto-lightblue">
        <BarChart3 className="h-5 w-5 mr-2" />
        Relatórios
      </Button>
    </Link>
  </>
);

export default Navbar;
