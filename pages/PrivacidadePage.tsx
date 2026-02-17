import React from 'react';
import { PrivacidadeContent } from '../components/PrivacidadeContent';

const PrivacidadePage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-white mb-8">Política de Privacidade</h1>
            <div className="glass-card p-8 rounded-3xl">
                <PrivacidadeContent />
            </div>
        </div>
    );
};

export default PrivacidadePage;
