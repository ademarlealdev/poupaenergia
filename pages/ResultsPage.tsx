
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { compareTariffs } from '../services/energyService';
import { BillData, ComparisonResult } from '../types';

interface ResultsPageProps {
  data: BillData | null;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ data: initialData }) => {
  const [data, setData] = useState<BillData | null>(initialData);
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getResults = async () => {
      if (data) {
        setLoading(true);
        const compResults = await compareTariffs(data);
        setResults(compResults);
        setLoading(false);
      }
    };
    getResults();
  }, [data]);

  const handleUpdateData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedData: BillData = {
      ...data!,
      consumoMensalKwh: Number(formData.get('consumo')),
      precoKwh: Number(formData.get('preco')),
    };
    setData(updatedData);
    setIsEditing(false);
  };

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Nenhum dado encontrado</h2>
        <p className="mb-8 text-gray-400">Por favor, faça primeiro o upload da sua fatura.</p>
        <Link to="/upload" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-primary/20">Voltar ao Upload</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-32 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-xl font-bold text-white">A comparar tarifários...</h2>
        <p className="text-gray-400">Estamos a analisar as melhores ofertas do mercado para si.</p>
      </div>
    );
  }

  const bestOption = results[0];

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="mb-12 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Boas notícias!</h1>
            <p className="text-gray-400">Encontrámos opções mais económicas para o seu perfil.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/5 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-all border border-white/10"
            >
              {isEditing ? 'Cancelar' : 'Ajustar Consumo'}
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-all border border-white/10"
            >
              Nova análise
            </button>
          </div>
        </div>

        {isEditing && (
          <form onSubmit={handleUpdateData} className="mb-12 p-8 glass-card rounded-3xl animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold border border-primary/20">1</div>
              <h3 className="font-bold text-white">Ajuste os dados para uma comparação 100% real</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Consumo Mensal (kWh)</label>
                <input required name="consumo" type="number" step="1" defaultValue={data.consumoMensalKwh} className="w-full px-5 py-3 rounded-xl bg-[#0B0F19] border border-white/10 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Preço p/ kWh atual (€)</label>
                <input required name="preco" type="number" step="0.0001" defaultValue={data.precoKwh} className="w-full px-5 py-3 rounded-xl bg-[#0B0F19] border border-white/10 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none font-bold" />
              </div>
            </div>
            <button type="submit" className="mt-8 w-full md:w-auto bg-primary text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
              Atualizar Comparação
            </button>
          </form>
        )}

        {!isEditing && (
          <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row gap-8 items-center justify-center md:justify-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center font-bold text-primary border border-white/5">€</div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">O seu Fornecedor</p>
                <p className="font-bold text-white capitalize">{data.fornecedorAtual}</p>
              </div>
            </div>
            <div className="h-px md:h-8 w-full md:w-px bg-white/10"></div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Consumo base</p>
              <p className="font-bold text-white">{data.consumoMensalKwh} kWh / mês</p>
            </div>
            <div className="h-px md:h-8 w-full md:w-px bg-white/10"></div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Preço base</p>
              <p className="font-bold text-white">{data.precoKwh} € / kWh</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Recommendation Card */}
      {bestOption && (
        <div className="glass-card rounded-3xl overflow-hidden mb-16 transform transition-transform hover:scale-[1.01] relative">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

          <div className="bg-primary/90 backdrop-blur-sm px-8 py-4 flex items-center justify-between text-white border-b border-white/10">
            <span className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"></path></svg>
              Melhor Opção Encontrada
            </span>
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full border border-white/10">Recomendado</span>
          </div>

          <div className="p-8 md:p-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-5 mb-8">
                  {bestOption.provider.logo && <img src={bestOption.provider.logo} alt={bestOption.provider.nome} className="w-20 h-20 rounded-2xl bg-white p-2 object-contain shadow-lg" />}
                  <div>
                    <h2 className="text-3xl font-bold text-white capitalize mb-1">{bestOption.provider.nome}</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold text-xl">{bestOption.provider.precoKwh} €</span>
                      <span className="text-gray-500 text-sm">/ kWh</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <p className="text-gray-400 text-xs mb-2 uppercase tracking-tight font-bold">Poupança Mensal</p>
                    <p className="text-3xl font-bold text-emerald-400">{bestOption.monthlySaving.toFixed(2)}€</p>
                  </div>
                  <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 blur-xl"></div>
                    <p className="text-primary text-xs mb-2 uppercase tracking-tight font-bold relative z-10">Poupança Anual</p>
                    <p className="text-3xl font-bold text-white relative z-10">{bestOption.annualSaving.toFixed(2)}€</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-8">
                  <div className="flex-grow bg-[#0B0F19] h-3 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-gradient-to-r from-primary to-[#8B5CF6] h-full rounded-full shadow-[0_0_10px_rgba(217,70,239,0.5)]" style={{ width: `${Math.min(bestOption.savingPercentage * 4, 100)}%` }}></div>
                  </div>
                  <span className="text-primary font-bold whitespace-nowrap">{bestOption.savingPercentage.toFixed(1)}% de poupança</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center border border-white/5">
                <p className="text-gray-300 font-medium mb-8 text-lg">Pronto para começar a pagar menos? Nós tratamos de toda a papelada gratuitamente.</p>
                <Link
                  to="/mudar"
                  className="w-full py-5 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                >
                  Mudar agora e poupar
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
                <p className="text-xs text-gray-500 mt-6 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Sem fidelização em tarifários domésticos
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <h3 className="text-2xl font-bold text-white mb-6">Comparação com o Mercado</h3>
      <div className="glass-card rounded-3xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-widest">
            <tr>
              <th className="px-8 py-6 font-semibold border-b border-white/5">Fornecedor</th>
              <th className="px-8 py-6 font-semibold border-b border-white/5">Preço kWh</th>
              <th className="px-8 py-6 font-semibold border-b border-white/5">Custo Anual</th>
              <th className="px-8 py-6 font-semibold border-b border-white/5">Poupança Mensal</th>
              <th className="px-8 py-6 font-semibold border-b border-white/5">Poupança Anual</th>
              <th className="px-8 py-6 font-semibold text-right border-b border-white/5">Acção</th>
            </tr>
          </thead>
          <tbody className="">
            {results.map((res, idx) => (
              <tr key={idx} className={`hover:bg-white/5 transition-colors ${idx === 0 ? 'bg-primary/5' : ''}`}>
                <td className="px-8 py-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    {res.provider.logo ? (
                      <img
                        src={res.provider.logo}
                        alt={res.provider.nome}
                        className="w-10 h-10 rounded-xl object-contain bg-white p-1"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white font-bold ${res.provider.logo ? 'hidden' : ''}`}>
                      {res.provider.nome.charAt(0)}
                    </div>
                    <span className="font-bold text-white capitalize">{res.provider.nome}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-gray-400 font-medium border-b border-white/5">{res.provider.precoKwh}€</td>
                <td className="px-8 py-6 font-bold text-white border-b border-white/5">{res.annualCost.toFixed(2)}€</td>
                <td className="px-8 py-6 border-b border-white/5">
                  {res.monthlySaving > 0 ? (
                    <span className="text-emerald-400 font-bold">-{res.monthlySaving.toFixed(2)}€</span>
                  ) : (
                    <span className="text-rose-400 font-bold">+{Math.abs(res.monthlySaving).toFixed(2)}€</span>
                  )}
                </td>
                <td className="px-8 py-6 border-b border-white/5">
                  {res.annualSaving > 0 ? (
                    <span className="text-emerald-400 font-bold">-{res.annualSaving.toFixed(2)}€</span>
                  ) : (
                    <span className="text-rose-400 font-bold">+{Math.abs(res.annualSaving).toFixed(2)}€</span>
                  )}
                </td>
                <td className="px-8 py-6 text-right border-b border-white/5">
                  <Link to="/mudar" className="text-primary font-bold hover:text-white transition-colors text-sm">Selecionar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsPage;
