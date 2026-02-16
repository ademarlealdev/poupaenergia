
import React, { useEffect, useState } from 'react';
import { getTariffs } from '../services/energyService';
import { updateTariffPrices } from '../services/energyUpdateService';
import { Provider } from '../types';
import { Link } from 'react-router-dom';

const TariffsPage: React.FC = () => {
    const [tariffs, setTariffs] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchTariffs = async () => {
        setLoading(true);
        const data = await getTariffs();
        setTariffs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTariffs();
    }, []);

    const handleUpdatePrices = async () => {
        setUpdating(true);
        try {
            // Call local Python server
            // Tip: You must run 'python scripts/server.py' in a terminal for this to work
            const response = await fetch('http://localhost:5000/update-tariffs?mock=true', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`Erro no servidor: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.success) {
                alert("Preços atualizados com sucesso! A recarregar dados...");
                await fetchTariffs(); // Refresh data from Supabase
            } else {
                throw new Error(result.message || "Falha desconhecida na atualização.");
            }

        } catch (error) {
            console.error("Failed to update prices:", error);
            alert("Erro ao conectar ao script Python. \n\nCertifique-se que correu: \n'python scripts/server.py' \nno terminal.");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-secondary mb-2">Tarifários de Eletricidade 2026</h1>
                    <p className="text-gray-500 max-w-2xl">
                        Consulte a lista completa de tarifários disponíveis no mercado livre.
                    </p>
                </div>

                <button
                    onClick={handleUpdatePrices}
                    disabled={updating}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                >
                    <svg className={`w-5 h-5 ${updating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {updating ? 'A atualizar...' : 'Atualizar Preços'}
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Fornecedor</th>
                                <th className="px-8 py-5">Preço kWh</th>
                                <th className="px-8 py-5 text-right">Ciclo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tariffs.map((tariff, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            {tariff.logo ? (
                                                <img
                                                    src={tariff.logo}
                                                    alt={tariff.nome}
                                                    className="w-10 h-10 rounded-xl object-contain bg-white border border-gray-100 p-1"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold ${tariff.logo ? 'hidden' : ''}`}>
                                                {tariff.nome.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-secondary text-lg capitalize">{tariff.nome}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-bold text-primary text-lg">{tariff.precoKwh} €</span>
                                        <span className="text-gray-400 text-xs ml-1">/ kWh</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Simples</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-12 text-center bg-primary/5 rounded-3xl p-8 md:p-12">
                <h2 className="text-2xl font-bold text-secondary mb-4">Quer saber qual o melhor para si?</h2>
                <p className="text-gray-500 mb-8">
                    O preço por kWh não é tudo. O melhor tarifário depende do seu consumo mensal e potência contratada.
                    Faça uma análise personalizada da sua fatura.
                </p>
                <Link
                    to="/upload"
                    className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-green-600 transition-all inline-flex items-center gap-2"
                >
                    Analisar a minha Fatura
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </Link>
            </div>
        </div>
    );
};

export default TariffsPage;
