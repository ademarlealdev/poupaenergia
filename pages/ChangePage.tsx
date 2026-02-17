
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { submitChangeRequest } from '../services/energyService';
import { ChangeFormData } from '../types';
import Modal from '../components/Modal';
import { TermosContent } from '../components/TermosContent';
import { PrivacidadeContent } from '../components/PrivacidadeContent';

const ChangePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { fornecedor?: string };

  const [formData, setFormData] = useState<ChangeFormData>({
    nome: '',
    nif: '',
    morada: '',
    cpe: '',
    iban: '',
    telefone: '',
    email: '',
    fornecedor: state?.fornecedor || ''
  });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    if (!state?.fornecedor) {
      navigate('/');
    }
  }, [state, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'telefone') setPhoneError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    // Phone Validation: Portuguese number (9 digits, starting with 9 or 2)
    const phoneRegex = /^[29]\d{8}$/;
    if (!phoneRegex.test(formData.telefone.replace(/\s/g, ''))) {
      setPhoneError("Número inválido");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitChangeRequest(formData);
      if (result) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("Houve um erro ao submeter o pedido. Por favor tente novamente.");
      }
    } catch (error) {
      alert("Houve um erro ao submeter o pedido.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/10 border border-green-500/30">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4">Pedido Enviado!</h1>
        <p className="text-xl text-gray-300 mb-10">
          Recebemos o seu pedido de mudança para a <strong className="text-white">{formData.fornecedor}</strong>. Um dos nossos especialistas entrará em contacto em breve (normalmente em menos de 2h úteis) para confirmar os detalhes.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary px-10 py-4 rounded-2xl text-lg shadow-lg hover:scale-105 transition-transform"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Quase lá!</h1>
        <p className="text-gray-400">Preencha os dados abaixo para concluir a mudança para <span className="text-primary font-bold">{formData.fornecedor}</span>.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
        {/* Background Gradient Effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Novo Fornecedor</label>
            <input
              required
              readOnly
              name="fornecedor"
              value={formData.fornecedor}
              className="w-full px-5 py-4 glass-input rounded-xl opacity-70 cursor-not-allowed font-bold text-primary"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Nome Completo</label>
            <input
              required
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="w-full px-5 py-4 glass-input rounded-xl"
              placeholder="Ex: Maria Santos"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">NIF</label>
            <input
              required
              name="nif"
              maxLength={9}
              value={formData.nif}
              onChange={handleInputChange}
              className="w-full px-5 py-4 glass-input rounded-xl"
              placeholder="Ex: 234567890"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Telefone</label>
            <input
              required
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              className={`w-full px-5 py-4 glass-input rounded-xl ${phoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              placeholder="Ex: 912345678"
            />
            {phoneError && (
              <p className="mt-2 text-xs text-red-400 font-medium flex items-center gap-1 animate-in slide-in-from-top-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {phoneError}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Email</label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-5 py-4 glass-input rounded-xl"
              placeholder="exemplo@email.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Morada Completa</label>
            <input
              required
              name="morada"
              value={formData.morada}
              onChange={handleInputChange}
              className="w-full px-5 py-4 glass-input rounded-xl"
              placeholder="Rua, Número, Andar, CP e Localidade"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Código CPE</label>
            <input
              required
              name="cpe"
              value={formData.cpe}
              onChange={handleInputChange}
              className="w-full px-5 py-4 glass-input rounded-xl"
              placeholder="Ex: PT0002..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">IBAN (Opcional)</label>
            <input
              name="iban"
              value={formData.iban}
              onChange={handleInputChange}
              className="w-full px-5 py-4 glass-input rounded-xl"
              placeholder="PT50..."
            />
          </div>
        </div>

        <div className="mt-8 flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
          <input
            type="checkbox"
            id="terms"
            required
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-gray-500 bg-transparent text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
          />
          <label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer select-none">
            Aceito os <button type="button" onClick={() => setShowTerms(true)} className="text-white font-bold hover:text-primary transition-colors hover:underline">termos de utilização</button> e a <button type="button" onClick={() => setShowPrivacy(true)} className="text-white font-bold hover:text-primary transition-colors hover:underline">política de privacidade</button>. Autorizo o processamento dos meus dados para a mudança de fornecedor (RGPD).
          </label>
        </div>

        <button
          type="submit"
          disabled={!agreed || submitting}
          className={`w-full mt-10 py-5 font-bold text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 ${(!agreed || submitting) ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed' : 'btn-primary hover:scale-[1.02]'}`}
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              A processar...
            </>
          ) : 'Confirmar Mudança'}
        </button>
      </form>

      <Modal isOpen={showTerms} onClose={() => setShowTerms(false)} title="Termos e Condições">
        <TermosContent />
      </Modal>

      <Modal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Política de Privacidade">
        <PrivacidadeContent />
      </Modal>
    </div>
  );
};

export default ChangePage;
