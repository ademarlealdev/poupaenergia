import React from 'react';
import { TermosContent } from '../components/TermosContent';

const TermosPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-white mb-8">Termos e Condições</h1>
            <div className="glass-card p-8 rounded-3xl">
                <TermosContent />
            </div>
        </div>
    );
};

export default TermosPage;
