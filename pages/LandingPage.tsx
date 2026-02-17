import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-transparent min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-32 md:pt-40 md:pb-48 overflow-hidden">
        {/* Animated Glows */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-blob mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[100px] animate-blob animation-delay-2000 opacity-30"></div>

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <div className="inline-block px-4 py-1.5 mb-8 bg-white/5 backdrop-blur-sm border border-white/10 text-primary text-sm font-semibold rounded-full shadow-lg shadow-primary/5">
            <span className="mr-2">⚡</span> Poupe até 200€ por ano na sua fatura
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight drop-shadow-sm">
            Descubra se está a pagar <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#8B5CF6]">energia a mais</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Faça upload da sua fatura e veja em segundos quanto pode poupar.
            Sem compromissos, 100% automático e gratuito.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link
              to="/upload"
              className="group relative w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-[0_0_40px_-10px_rgba(217,70,239,0.5)] hover:shadow-[0_0_60px_-15px_rgba(217,70,239,0.6)] flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Analisar a minha fatura</span>
              <svg className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </Link>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Análise em menos de 3s
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Como funciona</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Três passos simples para começar a poupar na sua conta de luz e gás sem qualquer custo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group glass-card p-10 rounded-3xl hover:bg-white/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all"></div>

              <div className="w-14 h-14 bg-white/5 border border-white/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">1. Upload Seguro</h3>
              <p className="text-gray-400 leading-relaxed">Carregue o PDF da sua última fatura de forma totalmente segura e encriptada.</p>
            </div>

            <div className="group glass-card p-10 rounded-3xl hover:bg-white/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-[#8B5CF6]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#8B5CF6]/10 transition-all"></div>

              <div className="w-14 h-14 bg-white/5 border border-white/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">2. Análise Inteligente</h3>
              <p className="text-gray-400 leading-relaxed">O nosso sistema identifica automaticamente as melhores tarifas para o seu perfil de consumo.</p>
            </div>

            <div className="group glass-card p-10 rounded-3xl hover:bg-white/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-all"></div>

              <div className="w-14 h-14 bg-white/5 border border-white/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">3. Resultados Imediatos</h3>
              <p className="text-gray-400 leading-relaxed">Receba um relatório detalhado com o potencial de poupança mensal e como mudar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto rounded-[2.5rem] bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-white/5 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full translate-y-[-50%] translate-x-[50%] blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full translate-y-[50%] translate-x-[-50%] blur-[80px]"></div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">Pronto para poupar centenas <br /> de euros por ano?</h2>
          <p className="text-gray-400 mb-12 max-w-xl mx-auto text-lg">Junte-se a milhares de utilizadores que já otimizaram os seus custos de energia com a nossa tecnologia de análise.</p>

          <div className="flex justify-center">
            <div className="bg-white/5 p-1.5 rounded-2xl md:rounded-full border border-white/10 flex flex-col md:flex-row w-full max-w-md">
              <input
                type="email"
                placeholder="O seu email profissional"
                className="bg-transparent border-none text-white placeholder-gray-500 px-6 py-3 outline-none w-full"
              />
              <Link
                to="/upload"
                className="px-8 py-3 bg-primary text-white font-bold rounded-xl md:rounded-full hover:bg-primary/90 transition-all shadow-lg whitespace-nowrap mt-2 md:mt-0 flex items-center justify-center"
              >
                Começar Agora
              </Link>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-6 md:mt-4">Ao clicar aceita os nossos termos e política de privacidade.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
