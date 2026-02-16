
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 flex items-center justify-between px-6 md:px-12">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">P</div>
        <span className="text-xl font-bold text-secondary tracking-tight">Poupa<span className="text-primary">Energia</span></span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link to="/" className="hover:text-primary transition-colors">Como funciona</Link>
        <Link to="/upload" className="hover:text-primary transition-colors">Analisar Fatura</Link>
        <Link to="/tarifarios" className="hover:text-primary transition-colors">Tarifários</Link>
      </div>

      <Link
        to="/upload"
        className="bg-primary hover:bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md"
      >
        Começar Grátis
      </Link>
    </nav>
  );
};

export default Navbar;
