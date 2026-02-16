
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC<{ hasData: boolean }> = ({ hasData }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, children, className }: { to: string, children: React.ReactNode, className?: string }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-full transition-all duration-200 ${isActive(to)
        ? 'bg-primary/10 text-primary font-bold'
        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
        } ${className || ''}`}
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ to, children, onClick }: { to: string, children: React.ReactNode, onClick: () => void }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-4 py-3 rounded-xl transition-all duration-200 ${isActive(to)
        ? 'bg-primary/10 text-primary font-bold'
        : 'text-gray-600 font-medium hover:bg-gray-50'
        }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="flex items-center justify-between px-6 md:px-12 h-full">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">P</div>
          <span className="text-xl font-bold text-secondary tracking-tight">Poupa<span className="text-primary">Energia</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2 text-sm font-medium">
          <NavLink to="/">Como funciona</NavLink>
          <NavLink to="/upload">Analisar Fatura</NavLink>
          <NavLink to="/tarifarios">Tarifários</NavLink>
          {hasData && (
            <NavLink to="/resultado" className="!text-primary font-bold">Resultados</NavLink>
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            to="/upload"
            className="bg-primary hover:bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md"
          >
            Começar Grátis
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute top-16 left-0 right-0 p-6 flex flex-col gap-2 shadow-xl animate-in fade-in slide-in-from-top-4">
          <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Como funciona</MobileNavLink>
          <MobileNavLink to="/upload" onClick={() => setIsMenuOpen(false)}>Analisar Fatura</MobileNavLink>
          <MobileNavLink to="/tarifarios" onClick={() => setIsMenuOpen(false)}>Tarifários</MobileNavLink>
          {hasData && (
            <MobileNavLink to="/resultado" onClick={() => setIsMenuOpen(false)}>Resultados</MobileNavLink>
          )}
          <Link
            to="/upload"
            className="bg-primary hover:bg-green-600 text-white px-5 py-3 rounded-xl text-center font-bold transition-all shadow-sm hover:shadow-md mt-4"
            onClick={() => setIsMenuOpen(false)}
          >
            Começar Grátis
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
