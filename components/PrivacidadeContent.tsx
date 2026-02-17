import React from 'react';

export const PrivacidadeContent: React.FC = () => {
    return (
        <div className="space-y-6 text-gray-300">
            <section>
                <h2 className="text-xl font-bold text-white mb-2">1. Recolha de Dados</h2>
                <p>Recolhemos apenas os dados estritamente necessários para a prestação do nosso serviço de análise e mudança de fornecedor de energia, incluindo nome, contacto e dados da fatura.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-2">2. Uso dos Dados</h2>
                <p>Os seus dados são utilizados exclusivamente para:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Analisar o seu perfil de consumo;</li>
                    <li>Comparar tarifas de mercado;</li>
                    <li>Processar o pedido de mudança de fornecedor, quando solicitado.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-2">3. Partilha de Dados</h2>
                <p>Não vendemos os seus dados a terceiros. Os seus dados apenas serão partilhados com o fornecedor de energia selecionado por si para efeitos de formalização do contrato.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-2">4. Segurança</h2>
                <p>Implementamos medidas de segurança técnicas e organizativas para proteger os seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-2">5. Os Seus Direitos</h2>
                <p>De acordo com o RGPD, tem o direito de aceder, retificar, limitar ou apagar os seus dados pessoais. Para exercer estes direitos, contacte-nos.</p>
            </section>

            <p className="text-sm text-gray-500 mt-8">Última atualização: {new Date().toLocaleDateString()}</p>
        </div>
    );
};
