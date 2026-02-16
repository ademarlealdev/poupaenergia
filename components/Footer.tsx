
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <span className="text-xl font-bold text-secondary tracking-tight">Poupa<span className="text-primary">Energia</span></span>
          </div>
          <p className="text-gray-500 max-w-sm">
            Ajudamos os portugueses a pagar menos pela energia através de análise inteligente de faturas e comparação transparente de tarifários.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Empresa</h4>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li>Sobre nós</li>
            <li>Termos de Serviço</li>
            <li>Política de Privacidade</li>
            <li>RGPD</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-4">Suporte</h4>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li>Centro de ajuda</li>
            <li>Contacto</li>
            <li>Blog de Poupança</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-50 text-center text-gray-400 text-xs">
        © {new Date().getFullYear()} Poupa Energia. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
