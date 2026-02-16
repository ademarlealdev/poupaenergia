
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
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Nenhum dado encontrado</h2>
        <p className="mb-8 text-gray-500">Por favor, faça primeiro o upload da sua fatura.</p>
        <Link to="/upload" className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Voltar ao Upload</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-xl font-bold text-secondary">A comparar tarifários...</h2>
        <p className="text-gray-500">Estamos a analisar as melhores ofertas do mercado para si.</p>
      </div>
    );
  }

  const bestOption = results[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-2">Boas notícias!</h1>
            <p className="text-gray-500">Encontrámos opções mais económicas para o seu perfil.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-accent/50 text-secondary px-6 py-3 rounded-xl font-bold text-sm hover:bg-accent transition-all"
            >
              {isEditing ? 'Cancelar' : 'Ajustar Consumo'}
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="bg-secondary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
            >
              Nova análise
            </button>
          </div>
        </div>

        {isEditing && (
          <form onSubmit={handleUpdateData} className="mb-10 p-8 bg-white rounded-3xl border-2 border-primary/20 shadow-xl shadow-primary/5 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">1</div>
              <h3 className="font-bold text-secondary">Ajuste os dados para uma comparação 100% real</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Consumo Mensal (kWh)</label>
                <input required name="consumo" type="number" step="1" defaultValue={data.consumoMensalKwh} className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary/20 outline-none font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Preço p/ kWh atual (€)</label>
                <input required name="preco" type="number" step="0.0001" defaultValue={data.precoKwh} className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary/20 outline-none font-bold" />
              </div>
            </div>
            <button type="submit" className="mt-8 w-full md:w-auto bg-primary text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-green-600 transition-all">
              Atualizar Comparação
            </button>
          </form>
        )}

        {!isEditing && (
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-8 items-center justify-center md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-primary">€</div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">O seu Fornecedor</p>
                <p className="font-bold text-secondary capitalize">{data.fornecedorAtual}</p>
              </div>
            </div>
            <div className="h-px md:h-8 w-full md:w-px bg-gray-200"></div>
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Consumo base</p>
              <p className="font-bold text-secondary">{data.consumoMensalKwh} kWh / mês</p>
            </div>
            <div className="h-px md:h-8 w-full md:w-px bg-gray-200"></div>
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Preço base</p>
              <p className="font-bold text-secondary">{data.precoKwh} € / kWh</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Recommendation Card */}
      {bestOption && (
        <div className="bg-white rounded-3xl shadow-xl shadow-primary/5 border-2 border-primary/20 overflow-hidden mb-12 transform transition-transform hover:scale-[1.01]">
          <div className="bg-primary px-8 py-4 flex items-center justify-between text-white">
            <span className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"></path></svg>
              Melhor Opção Encontrada
            </span>
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">Recomendado</span>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  {bestOption.provider.logo && <img src={bestOption.provider.logo} alt={bestOption.provider.nome} className="w-16 h-16 rounded-2xl shadow-sm border border-gray-100" />}
                  <div>
                    <h2 className="text-2xl font-bold text-secondary capitalize">{bestOption.provider.nome}</h2>
                    <p className="text-primary font-semibold">{bestOption.provider.precoKwh} €/kWh</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-gray-400 text-xs mb-1 uppercase tracking-tight">Poupança Mensal</p>
                    <p className="text-2xl font-bold text-primary">{bestOption.monthlySaving.toFixed(2)}€</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                    <p className="text-primary/60 text-xs mb-1 uppercase tracking-tight font-bold">Poupança Anual</p>
                    <p className="text-2xl font-bold text-primary">{bestOption.annualSaving.toFixed(2)}€</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-8">
                  <div className="flex-grow bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${Math.min(bestOption.savingPercentage * 4, 100)}%` }}></div>
                  </div>
                  <span className="text-primary font-bold">{bestOption.savingPercentage.toFixed(1)}% de poupança</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                <p className="text-secondary font-medium mb-6">Pronto para começar a pagar menos? Nós tratamos de toda a papelada gratuitamente.</p>
                <Link
                  to="/mudar"
                  className="w-full py-5 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-green-600 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                >
                  Mudar agora e poupar
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
                <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  Sem fidelização em tarifários domésticos
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <h3 className="text-xl font-bold text-secondary mb-6">Comparação com o Mercado</h3>
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Fornecedor</th>
              <th className="px-8 py-5">Preço kWh</th>
              <th className="px-8 py-5">Custo Anual</th>
              <th className="px-8 py-5">Poupança Mensal</th>
              <th className="px-8 py-5">Poupança Anual</th>
              <th className="px-8 py-5 text-right">Acção</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {results.map((res, idx) => (
              <tr key={idx} className={idx === 0 ? 'bg-primary/5' : ''}>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    {res.provider.logo ? (
                      <img
                        src={res.provider.logo}
                        alt={res.provider.nome}
                        className="w-10 h-10 rounded-xl object-contain bg-white border border-gray-100 p-1"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold ${res.provider.logo ? 'hidden' : ''}`}>
                      {res.provider.nome.charAt(0)}
                    </div>
                    <span className="font-bold text-secondary capitalize">{res.provider.nome}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-gray-500 font-medium">{res.provider.precoKwh}€</td>
                <td className="px-8 py-6 font-bold text-secondary">{res.annualCost.toFixed(2)}€</td>
                <td className="px-8 py-6">
                  {res.monthlySaving > 0 ? (
                    <span className="text-primary font-bold">-{res.monthlySaving.toFixed(2)}€</span>
                  ) : (
                    <span className="text-red-500 font-bold">+{Math.abs(res.monthlySaving).toFixed(2)}€</span>
                  )}
                </td>
                <td className="px-8 py-6">
                  {res.annualSaving > 0 ? (
                    <span className="text-primary font-bold">-{res.annualSaving.toFixed(2)}€</span>
                  ) : (
                    <span className="text-red-500 font-bold">+{Math.abs(res.annualSaving).toFixed(2)}€</span>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <Link to="/mudar" className="text-primary font-bold hover:underline text-sm">Selecionar</Link>
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
