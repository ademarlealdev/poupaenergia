
import React, { useEffect, useState } from 'react';
import { getTariffs } from '../services/energyService';
import { Provider } from '../types';
import { Link } from 'react-router-dom';

const TariffsPage: React.FC = () => {
    const [tariffs, setTariffs] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTariffs = async () => {
            const data = await getTariffs();
            setTariffs(data);
            setLoading(false);
        };
        fetchTariffs();
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-secondary mb-4">Tarifários de Eletricidade 2026</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Consulte a lista completa de tarifários disponíveis no mercado livre.
                    Estes dados são atualizados regularmente com base nas ofertas públicas dos comercializadores.
                </p>
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
                                                <img src={tariff.logo} alt={tariff.nome} className="w-10 h-10 rounded-xl object-contain bg-white border border-gray-100 p-1" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold">
                                                    {tariff.nome.charAt(0)}
                                                </div>
                                            )}
                                            <span className="font-bold text-secondary text-lg">{tariff.nome}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-bold text-primary text-lg">{tariff.precoKwh.toFixed(4)} €</span>
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
