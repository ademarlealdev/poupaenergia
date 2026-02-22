
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BillData } from '../types';
import { supabase } from '../services/supabaseClient';

interface SimulationResult {
  comercializador: string;
  nome_oferta: string;
  potencia_contratada: number;
  consumo_kwh: number;
  termo_fixo_diario: number;
  energia_unitario: number;
  p_ponta: number;
  p_cheias: number;
  p_vazio: number;
  ciclo: string;
  termo_fixo_anual: number;
  energia_anual: number;
  taxas_impostos_anual: number;
  faturacao_total_anual: number;
  pagamento: string;
  digital: string;
  logotipo: string;
}

interface ResultsPageProps {
  data: BillData | null;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ data: initialData }) => {
  const [data, setData] = useState<BillData | null>(initialData);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const getPowerId = (powerLabel: string) => {
    const val = parseFloat(powerLabel?.toLowerCase().replace('kva', '').replace(',', '.').trim()) || 6.9;
    if (val <= 1.15) return "0";
    if (val <= 2.3) return "1";
    if (val <= 3.45) return "2";
    if (val <= 4.6) return "3";
    if (val <= 5.75) return "4";
    if (val <= 6.9) return "5";
    if (val <= 10.35) return "6";
    if (val <= 13.8) return "7";
    if (val <= 17.25) return "8";
    return "9"; // 20.7+
  };

  const getCycleId = (cycleLabel: string) => {
    if (cycleLabel?.toLowerCase().includes('bi')) return "2";
    if (cycleLabel?.toLowerCase().includes('tri')) return "3";
    return "1";
  };

  useEffect(() => {
    const fetchSimulation = async () => {
      if (!data) return;
      setLoading(true);
      setError(null);
      try {
        const powerId = getPowerId(data.potenciaContratada);
        const cycleId = getCycleId(data.cicloHorario || "Simples");

        // Calculate consumption values based on cycle
        let ePonta = 0, eCheias = 0, eVazio = 0;

        if (cycleId === "1") {
          ePonta = data.consumoMensalKwh || (data.consumoPonta || 0) + (data.consumoCheias || 0) + (data.consumoVazio || 0);
          eCheias = 0;
          eVazio = 0;
        } else if (cycleId === "2") {
          ePonta = data.consumoPonta || (data.consumoMensalKwh * 0.6);
          eCheias = data.consumoCheias || (data.consumoMensalKwh * 0.4);
          eVazio = 0;
        } else {
          ePonta = data.consumoPonta || (data.consumoMensalKwh * 0.17);
          eCheias = data.consumoCheias || (data.consumoMensalKwh * 0.43);
          eVazio = data.consumoVazio || (data.consumoMensalKwh * 0.4);
        }

        // Use Supabase Edge Function for global accessibility
        const { data: simData, error: simError } = await supabase.functions.invoke('erse-simulation', {
          body: {
            power_id: powerId,
            cycle: cycleId,
            e_ponta: Math.round(ePonta),
            e_cheias: Math.round(eCheias),
            e_vazio: Math.round(eVazio)
          }
        });

        if (simError) throw simError;
        console.log('Results fetched from Edge Function:', simData);

        if (Array.isArray(simData)) {
          setResults(simData);
        } else {
          setResults([]);
        }
      } catch (err: any) {
        console.error('Fetch error on ResultsPage:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulation();
  }, [data]);

  const handleUpdateData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedData: BillData = {
      ...data!,
      consumoMensalKwh: Number(formData.get('consumo')),
      precoKwh: Number(formData.get('preco')),
      potenciaContratada: formData.get('potencia') as string,
      termoPotencia: Number(formData.get('termoPotencia')),
      cicloHorario: formData.get('ciclo') as 'Simples' | 'Bi-horária' | 'Tri-horária',
      consumoPonta: Number(formData.get('consumoPonta') || 0),
      consumoCheias: Number(formData.get('consumoCheias') || 0),
      consumoVazio: Number(formData.get('consumoVazio') || 0),
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

  const currentAnnualCost = (data.consumoMensalKwh * data.precoKwh * 12) + (data.termoPotencia * 365);
  const bestOffer = results[0];
  const annualSaving = bestOffer ? currentAnnualCost - bestOffer.faturacao_total_anual : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              {annualSaving > 0 ? "Oportunidade de Poupança!" : "Parabéns!"}
            </h1>
            <p className="text-gray-400 font-medium">
              {annualSaving > 0
                ? `Pode poupar cerca de ${annualSaving.toFixed(2)}€ por ano com uma mudança.`
                : "Já tem a melhor oferta do mercado para o seu perfil de consumo! 🎉"}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/5 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-all border border-white/10"
            >
              {isEditing ? 'Cancelar' : 'Ajustar Dados'}
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              Nova Análise
            </button>
          </div>
        </div>

        {isEditing && (
          <form onSubmit={handleUpdateData} className="mb-12 p-8 glass-card rounded-3xl animate-in fade-in slide-in-from-top-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Consumo Mensal (kWh)</label>
                <input required name="consumo" type="number" defaultValue={data.consumoMensalKwh} className="w-full px-5 py-3 rounded-xl bg-[#161B26] border border-white/10 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Preço kWh Atual (€)</label>
                <input required name="preco" type="number" step="0.0001" defaultValue={data.precoKwh} className="w-full px-5 py-3 rounded-xl bg-[#161B26] border border-white/10 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Potência</label>
                <input required name="potencia" defaultValue={data.potenciaContratada} className="w-full px-5 py-3 rounded-xl bg-[#161B26] border border-white/10 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Termo Potência (€/dia)</label>
                <input required name="termoPotencia" type="number" step="0.0001" defaultValue={data.termoPotencia} className="w-full px-5 py-3 rounded-xl bg-[#161B26] border border-white/10 text-white" />
              </div>
              <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-white/5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Ciclo</label>
                  <select name="ciclo" defaultValue={data.cicloHorario || "Simples"} className="w-full px-5 py-3 rounded-xl bg-[#161B26] border border-white/10 text-white">
                    <option value="Simples">Simples</option>
                    <option value="Bi-horária">Bi-horária</option>
                    <option value="Tri-horária">Tri-horária</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Consumo Ponta (kWh)</label>
                  <input name="consumoPonta" type="number" defaultValue={data.consumoPonta || 0} className="w-full px-5 py-3 rounded-xl bg-[#161B26] border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Consumo Cheias/Fora Vazio (kWh)</label>
                  <input name="consumoCheias" type="number" defaultValue={data.consumoCheias || 0} className="w-full px-5 py-3 rounded-xl bg-[#161B26] border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Consumo Vazio (kWh)</label>
                  <input name="consumoVazio" type="number" defaultValue={data.consumoVazio || 0} className="w-full px-5 py-3 rounded-xl bg-[#161B26] border border-white/10 text-white" />
                </div>
              </div>
              <div className="lg:col-span-3">
                <button type="submit" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                  Atualizar Simulação
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm mb-16 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Operador Atual</p>
              <p className="text-xl font-bold text-white capitalize">{data.fornecedorAtual}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Gasto Atual (Estimado)</p>
              <p className="text-xl font-bold text-emerald-400">~{currentAnnualCost.toFixed(2)}€ / ano</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Potência Extraída</p>
              <p className="text-xl font-bold text-white">{data.potenciaContratada}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Ciclo Detetado</p>
              <p className="text-xl font-bold text-white">{data.cicloHorario || "Simples"}</p>
            </div>
          </div>

          {(data.consumoPonta || data.consumoCheias || data.consumoVazio) && (
            <div className="bg-white/5 border-t border-white/5 px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.cicloHorario === 'Tri-horária' && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Consumo Ponta</span>
                  <span className="text-sm font-bold text-white">{data.consumoPonta || 0} kWh</span>
                </div>
              )}
              {(data.cicloHorario === 'Bi-horária' || data.cicloHorario === 'Tri-horária') && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">
                    {data.cicloHorario === 'Bi-horária' ? 'Fora de Vazio' : 'Consumo Cheias'}
                  </span>
                  <span className="text-sm font-bold text-white">{data.consumoCheias || 0} kWh</span>
                </div>
              )}
              {(data.cicloHorario === 'Bi-horária' || data.cicloHorario === 'Tri-horária') && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Consumo Vazio</span>
                  <span className="text-sm font-bold text-white">{data.consumoVazio || 0} kWh</span>
                </div>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-white/5 h-[400px] rounded-3xl border border-white/10"></div>)}
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-400">
            Erro: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.length > 0 ? results.map((offer, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-[40px] hover:bg-white/10 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden">
                {idx === 0 && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-white text-[10px] font-black px-6 py-2 rounded-bl-3xl shadow-2xl uppercase tracking-tighter">
                      Melhor Opção
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-8">
                  <div className="bg-white rounded-2xl p-3 h-14 w-28 flex items-center justify-center shadow-inner">
                    {offer.logotipo ? (
                      <img src={offer.logotipo} alt={offer.comercializador} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="font-bold text-gray-900 text-xs text-center">{offer.comercializador}</span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${offer.ciclo === "1" || offer.ciclo === "Simples" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" :
                      offer.ciclo === "2" || offer.ciclo?.includes("Bi") ? "border-blue-500/30 text-blue-400 bg-blue-500/5" :
                        "border-purple-500/30 text-purple-400 bg-purple-500/5"
                      }`}>
                      {offer.ciclo === "1" || offer.ciclo === "Simples" ? "Simples" :
                        offer.ciclo === "2" || offer.ciclo?.includes("Bi") ? "Bi-Horária" : "Tri-Horária"}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-6 line-clamp-2 h-16 group-hover:text-primary transition-colors leading-tight">
                  {offer.nome_oferta}
                </h3>

                <div className="space-y-4 text-sm border-t border-white/5 pt-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                      <span className="text-[10px] text-gray-500 uppercase block mb-1 font-bold">Termo Fixo</span>
                      <span className="text-sm font-bold text-emerald-400">{(offer.termo_fixo_diario || 0).toFixed(4)}€</span>
                      <span className="text-[10px] text-gray-500 block">/ dia</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 overflow-hidden">
                      <span className="text-[10px] text-gray-500 uppercase block mb-1 font-bold">Energia</span>
                      {(offer.ciclo === "1" || offer.ciclo === "Simples") ? (
                        <>
                          <span className="text-sm font-bold text-emerald-400">{(offer.energia_unitario || 0).toFixed(4)}€</span>
                          <span className="text-[10px] text-gray-500 block">/ kWh</span>
                        </>
                      ) : (offer.ciclo === "2" || offer.ciclo?.includes("Bi")) ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-gray-500">Fora Vazio:</span>
                            <span className="text-emerald-400 font-bold">{(offer.p_ponta || 0).toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-gray-500">Vazio:</span>
                            <span className="text-emerald-400 font-bold">{(offer.p_cheias || 0).toFixed(4)}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-0.5">
                          <div className="flex justify-between items-center text-[9px]">
                            <span className="text-gray-500">Ponta:</span>
                            <span className="text-emerald-400 font-bold">{(offer.p_ponta || 0).toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between items-center text-[9px]">
                            <span className="text-gray-500">Cheias:</span>
                            <span className="text-emerald-400 font-bold">{(offer.p_cheias || 0).toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between items-center text-[9px]">
                            <span className="text-gray-500">Vazio:</span>
                            <span className="text-emerald-400 font-bold">{(offer.p_vazio || 0).toFixed(4)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/5 pt-6 mt-8">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block font-bold tracking-widest mb-1">Custo Total Anual</span>
                      <span className="text-4xl font-black text-white">{(offer.faturacao_total_anual || 0).toFixed(2)}€</span>
                    </div>
                    <div className="text-right">
                      {currentAnnualCost - (offer.faturacao_total_anual || 0) > 0 ? (
                        <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                          Poupa {(currentAnnualCost - (offer.faturacao_total_anual || 0)).toFixed(0)}€
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-500 uppercase font-bold">{offer.pagamento}</span>
                      )}
                    </div>
                  </div>

                  <Link
                    to="/mudar"
                    state={{ fornecedor: offer.comercializador }}
                    className="w-full mt-8 block py-4 bg-white text-gray-900 font-bold rounded-2xl text-center hover:bg-primary hover:text-white transition-all shadow-xl"
                  >
                    Mudar Agora
                  </Link>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center bg-white/5 border border-white/10 rounded-[40px]">
                <p className="text-gray-500 font-bold uppercase tracking-widest mb-2">Sem resultados da ERSE</p>
                <p className="text-sm text-gray-600">Tente ajustar os seus dados ou escolher outro ciclo horário.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
