
import React, { useEffect, useState } from 'react';
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

const SimulationPage: React.FC = () => {
    const [results, setResults] = useState<SimulationResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [powerId, setPowerId] = useState("3"); // 4.6 kVA
    const [cycle, setCycle] = useState("1"); // Simples

    // Consumption state
    const [ePonta, setEPonta] = useState("1900");
    const [eCheias, setECheias] = useState("0");
    const [eVazio, setEVazio] = useState("0");

    // Reset consumption to defaults when cycle changes
    useEffect(() => {
        if (cycle === "1") {
            setEPonta("1900");
            setECheias("0");
            setEVazio("0");
        } else if (cycle === "2") {
            setEPonta("1140");
            setECheias("760");
            setEVazio("0");
        } else if (cycle === "3") {
            setEPonta("325");
            setECheias("815");
            setEVazio("760");
        }
    }, [cycle]);

    useEffect(() => {
        const fetchSimulation = async () => {
            setLoading(true);
            try {
                // Use Supabase Edge Function for global accessibility
                const { data, error } = await supabase.functions.invoke('erse-simulation', {
                    body: {
                        power_id: powerId,
                        cycle: cycle,
                        e_ponta: ePonta,
                        e_cheias: eCheias,
                        e_vazio: eVazio
                    }
                });

                if (error) throw error;
                console.log('Received simulation data from Edge Function:', data);
                setResults(data);
            } catch (err: any) {
                console.error('Simulation error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (powerId && cycle) {
            fetchSimulation();
        }
    }, [powerId, cycle, ePonta, eCheias, eVazio]);

    const getConsumptionText = () => {
        const total = (parseFloat(ePonta) || 0) + (parseFloat(eCheias) || 0) + (parseFloat(eVazio) || 0);
        return `${total.toFixed(0)} kWh`;
    };

    const powerOptions = [
        { id: "0", label: "1.15 kVA" },
        { id: "1", label: "2.3 kVA" },
        { id: "2", label: "3.45 kVA" },
        { id: "3", label: "4.60 kVA" },
        { id: "4", label: "5.75 kVA" },
        { id: "5", label: "6.90 kVA" },
        { id: "6", label: "10.35 kVA" },
        { id: "7", label: "13.80 kVA" },
        { id: "8", label: "17.25 kVA" },
        { id: "9", label: "20.70 kVA" },
    ];

    const cycleOptions = [
        { id: "1", label: "Simples" },
        { id: "2", label: "Bi-Horário" },
        { id: "3", label: "Tri-Horário" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="mb-12">
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                        Simulação Manual
                    </h1>
                    <p className="text-gray-400">
                        Descubra as melhores ofertas do mercado sem precisar de carregar a sua fatura.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Filters Card */}
                    <div className="lg:col-span-3 bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-sm shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Potência Contratada</label>
                                <select
                                    value={powerId}
                                    onChange={(e) => setPowerId(e.target.value)}
                                    className="w-full bg-[#161B26] border border-white/10 rounded-2xl px-5 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                                >
                                    {powerOptions.map(opt => (
                                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Ciclo Horário</label>
                                <div className="flex bg-[#161B26] p-1.5 rounded-2xl border border-white/10">
                                    {cycleOptions.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setCycle(opt.id)}
                                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${cycle === opt.id
                                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Consumo Mensal Estimado</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {cycle === "1" ? (
                                        <div className="col-span-3">
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={ePonta}
                                                    onChange={(e) => setEPonta(e.target.value)}
                                                    className="w-full bg-[#161B26] border border-white/10 rounded-2xl px-5 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                />
                                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500">kWh</span>
                                            </div>
                                        </div>
                                    ) : cycle === "2" ? (
                                        <>
                                            <div className="col-span-1.5 flex flex-col gap-2">
                                                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Fora Vazio</span>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={ePonta}
                                                        onChange={(e) => setEPonta(e.target.value)}
                                                        className="w-full bg-[#161B26] border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-1.5 flex flex-col gap-2">
                                                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Vazio</span>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={eCheias}
                                                        onChange={(e) => setECheias(e.target.value)}
                                                        className="w-full bg-[#161B26] border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Ponta</span>
                                                <input
                                                    type="number"
                                                    value={ePonta}
                                                    onChange={(e) => setEPonta(e.target.value)}
                                                    className="w-full bg-[#161B26] border border-white/10 rounded-2xl px-3 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Cheias</span>
                                                <input
                                                    type="number"
                                                    value={eCheias}
                                                    onChange={(e) => setECheias(e.target.value)}
                                                    className="w-full bg-[#161B26] border border-white/10 rounded-2xl px-3 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Vazio</span>
                                                <input
                                                    type="number"
                                                    value={eVazio}
                                                    onChange={(e) => setEVazio(e.target.value)}
                                                    className="w-full bg-[#161B26] border border-white/10 rounded-2xl px-3 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic">
                                Simulação anual estimada: <span className="text-white">{getConsumptionText()}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white/5 h-[450px] rounded-[40px] border border-white/10"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[40px] text-red-400 flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/20">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div>
                            <p className="font-bold text-lg mb-1">Ocorreu um erro</p>
                            <p className="text-sm opacity-80">{error}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {results.length > 0 ? results.map((offer, idx) => (
                            <div
                                key={idx}
                                className="bg-white/5 border border-white/10 p-8 rounded-[40px] hover:bg-white/10 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden flex flex-col"
                            >
                                {idx === 0 && (
                                    <div className="absolute top-0 right-0">
                                        <div className="bg-primary text-white text-[10px] font-black px-6 py-2 rounded-bl-3xl shadow-2xl uppercase tracking-tighter">
                                            Melhor Preço
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

                                <div className="space-y-4 text-sm border-t border-white/5 pt-8 flex-grow">
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
                                            <span className="text-[10px] text-gray-500 uppercase font-bold text-gray-600 mb-1 block">Pagamento</span>
                                            <span className="text-[10px] font-bold text-gray-400 line-clamp-1">{offer.pagamento}</span>
                                        </div>
                                    </div>

                                    <button
                                        className="w-full mt-8 py-4 bg-white text-gray-900 font-bold rounded-2xl text-center hover:bg-primary hover:text-white transition-all shadow-xl group/btn overflow-hidden relative"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Mudar Agora
                                            <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-20 text-center bg-white/5 border border-white/10 rounded-[40px]">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-gray-500 font-bold uppercase tracking-widest mb-2">Sem resultados da ERSE</p>
                                <p className="text-sm text-gray-600">Tente ajustar a potência ou o ciclo para ver outras ofertas.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimulationPage;
