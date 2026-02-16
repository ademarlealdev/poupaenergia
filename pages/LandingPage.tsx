
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-6 bg-primary/10 text-primary text-sm font-semibold rounded-full">
            🚀 Poupe até 200€ por ano
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-secondary mb-6 leading-tight">
            Descubra se está a pagar <br /> <span className="text-primary">energia a mais</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Faça upload da sua fatura e veja em segundos quanto pode poupar. 
            Sem compromissos, 100% automático e gratuito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/upload" 
              className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-green-600 transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2"
            >
              Analisar a minha fatura
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </Link>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              Análise em menos de 10s
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary mb-4">Comece a poupar hoje</h2>
            <p className="text-gray-500">O processo é simples, rápido e totalmente digital.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">1. Upload da fatura</h3>
              <p className="text-gray-500">Arraste a sua fatura em PDF ou imagem para o nosso sistema seguro.</p>
            </div>

            <div className="group text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">2. Comparação automática</h3>
              <p className="text-gray-500">O nosso motor de IA analisa os dados e compara com todos os fornecedores.</p>
            </div>

            <div className="group text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">3. Mudar e poupar</h3>
              <p className="text-gray-500">Se houver poupança, tratamos de tudo para mudar de fornecedor num clique.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto rounded-3xl bg-secondary p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary opacity-20 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <h2 className="text-3xl font-bold mb-6">Pronto para pagar menos?</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">Milhares de portugueses já pouparam mais de 1 milhão de euros em faturas de eletricidade este ano.</p>
          <Link 
            to="/upload" 
            className="inline-block px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-green-600 transition-all shadow-lg"
          >
            Começar Agora
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
