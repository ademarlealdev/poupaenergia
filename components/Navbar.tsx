import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC<{ hasData: boolean }> = ({ hasData }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, children, className }: { to: string, children: React.ReactNode, className?: string }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive(to)
        ? 'text-white bg-white/10'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
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
        : 'text-gray-400 font-medium hover:bg-gray-50'
        }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-[#0B0F19]/80 backdrop-blur-md border-b border-white/5 z-50 transition-all">
      <div className="relative flex items-center justify-between px-6 md:px-12 h-full">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="EnergiaCerta Logo" className="w-9 h-9" />
          <span className="text-xl font-bold text-white tracking-tight">Energia<span className="text-primary">Certa</span></span>
        </Link>

        {/* Desktop Menu - Centered */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-1 bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/5">
          <NavLink to="/">Como funciona</NavLink>
          <NavLink to="/upload">Analisar Fatura</NavLink>
          <NavLink to="/tarifarios">Tarifários</NavLink>
          {hasData && (
            <NavLink to="/resultado" className="!text-primary font-bold">Resultados</NavLink>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              to="/upload"
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
            >
              Começar Grátis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0B0F19] border-b border-white/5 absolute top-20 left-0 right-0 p-6 flex flex-col gap-2 shadow-xl animate-in fade-in slide-in-from-top-4">
          <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Como funciona</MobileNavLink>
          <MobileNavLink to="/upload" onClick={() => setIsMenuOpen(false)}>Analisar Fatura</MobileNavLink>
          <MobileNavLink to="/tarifarios" onClick={() => setIsMenuOpen(false)}>Tarifários</MobileNavLink>
          {hasData && (
            <MobileNavLink to="/resultado" onClick={() => setIsMenuOpen(false)}>Resultados</MobileNavLink>
          )}
          <Link
            to="/upload"
            className="bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-xl text-center font-bold transition-all shadow-lg mt-4"
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
