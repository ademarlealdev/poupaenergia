import React from 'react';

export const TermosContent: React.FC = () => {
    return (
        <div className="space-y-6 text-gray-300">
            <section>
                <h2 className="text-xl font-bold text-white mb-2">1. Introdução</h2>
                <p>Bem-vindo ao Poupa Energia. Ao utilizar o nosso website e serviços, concorda com estes termos e condições na sua totalidade. Se não concordar com estes termos, por favor não utilize o nosso website.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-2">2. Uso do Serviço</h2>
                <p>O nosso serviço consiste na análise e comparação de tarifas de energia. O utilizador compromete-se a fornecer informações verdadeiras e precisas.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-2">3. Propriedade Intelectual</h2>
                <p>Todo o conteúdo deste website, incluindo textos, gráficos, logótipos e imagens, é propriedade exclusiva do Poupa Energia ou dos seus licenciadores.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-2">4. Limitação de Responsabilidade</h2>
                <p>O Poupa Energia não se responsabiliza por quaisquer danos diretos, indiretos, incidentais ou consequentes resultantes do uso ou incapacidade de uso do nosso serviço.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-2">5. Alterações aos Termos</h2>
                <p>Reservamo-nos o direito de alterar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a sua publicação no website.</p>
            </section>

            <p className="text-sm text-gray-500 mt-8">Última atualização: {new Date().toLocaleDateString()}</p>
        </div>
    );
};
