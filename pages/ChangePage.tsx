
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitChangeRequest } from '../services/energyService';
import { ChangeFormData } from '../types';

const ChangePage: React.FC = () => {
  const [formData, setFormData] = useState<ChangeFormData>({
    nome: '',
    nif: '',
    morada: '',
    cpe: '',
    iban: '',
    telefone: '',
    email: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setSubmitting(true);
    try {
      await submitChangeRequest(formData);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert("Houve um erro ao submeter o pedido.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/30">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-4xl font-extrabold text-secondary mb-4">Pedido Enviado!</h1>
        <p className="text-xl text-gray-500 mb-10">
          Recebemos o seu pedido de mudança. Um dos nossos especialistas entrará em contacto em breve (normalmente em menos de 2h úteis) para confirmar os detalhes.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-secondary text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:opacity-90"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-secondary mb-2">Quase lá!</h1>
        <p className="text-gray-500">Preencha os dados abaixo para darmos início à mudança.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">Nome Completo</label>
            <input 
              required
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
              placeholder="Ex: Maria Santos"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">NIF</label>
            <input 
              required
              name="nif"
              maxLength={9}
              value={formData.nif}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
              placeholder="Ex: 234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">Telefone</label>
            <input 
              required
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
              placeholder="Ex: 912345678"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">Email</label>
            <input 
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
              placeholder="exemplo@email.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">Morada Completa</label>
            <input 
              required
              name="morada"
              value={formData.morada}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
              placeholder="Rua, Número, Andar, CP e Localidade"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">Código CPE</label>
            <input 
              required
              name="cpe"
              value={formData.cpe}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
              placeholder="Ex: PT0002..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">IBAN (Opcional)</label>
            <input 
              name="iban"
              value={formData.iban}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
              placeholder="PT50..."
            />
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3">
          <input 
            type="checkbox" 
            id="terms" 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="terms" className="text-sm text-gray-500">
            Aceito os <span className="text-primary font-bold cursor-pointer hover:underline">termos de utilização</span> e a <span className="text-primary font-bold cursor-pointer hover:underline">política de privacidade</span>. Autorizo o processamento dos meus dados para a mudança de fornecedor (RGPD).
          </label>
        </div>

        <button 
          type="submit"
          disabled={!agreed || submitting}
          className={`w-full mt-10 py-5 bg-primary text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 ${(!agreed || submitting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              A processar...
            </>
          ) : 'Confirmar Mudança'}
        </button>
      </form>
    </div>
  );
};

export default ChangePage;
