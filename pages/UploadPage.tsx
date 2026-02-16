
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractBillData } from '../services/energyService';
import { BillData } from '../types';

interface UploadPageProps {
  onDataExtracted: (data: BillData) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onDataExtracted }) => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showManualForm, setShowManualForm] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!file) return;

    setAnalyzing(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 5;
      });
    }, 100);

    try {
      const data = await extractBillData(file);
      setProgress(100);
      onDataExtracted(data);
      setTimeout(() => {
        navigate('/resultado');
      }, 500);
    } catch (error: any) {
      console.error("Extraction failed", error);
      if (error.message === "AI_LIMIT_EXCEEDED") {
        setErrorStatus("O serviço de Inteligência Artificial está temporariamente indisponível (limite de quota).");
        setShowManualForm(true);
      } else {
        alert("Erro ao extrair dados. Por favor tente novamente ou preencha manualmente.");
        setShowManualForm(true);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const manualData: BillData = {
      fornecedorAtual: formData.get('fornecedor') as string,
      consumoMensalKwh: Number(formData.get('consumo')),
      potenciaContratada: formData.get('potencia') as string,
      precoKwh: Number(formData.get('preco')),
      totalFatura: Number(formData.get('total')),
    };
    onDataExtracted(manualData);
    navigate('/resultado');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-secondary mb-2">Análise de Fatura</h1>
        <p className="text-gray-500">Envie a sua fatura em PDF ou imagem para começarmos.</p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center transition-all hover:border-primary/50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!analyzing ? (
          <>
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>

            {file ? (
              <div className="mb-6">
                <p className="font-semibold text-secondary">{file.name}</p>
                <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-500 text-xs font-medium mt-2 hover:underline"
                >
                  Remover ficheiro
                </button>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-lg font-medium text-secondary mb-1">Arraste a fatura para aqui</p>
                <p className="text-gray-400">ou clique para selecionar do seu computador</p>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,image/*"
              className="hidden"
            />

            <button
              onClick={() => file ? startAnalysis() : fileInputRef.current?.click()}
              className={`px-10 py-4 ${file ? 'bg-primary' : 'bg-secondary'} text-white font-bold rounded-2xl transition-all shadow-lg hover:opacity-90 min-w-[200px]`}
            >
              {file ? 'Analisar Fatura' : 'Selecionar Ficheiro'}
            </button>
          </>
        ) : (
          <div className="py-10">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">A extrair dados...</h3>
            <p className="text-gray-500 mb-8">Estamos a identificar o seu consumo e tarifário atual.</p>

            <div className="max-w-sm mx-auto bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs font-bold text-primary mt-3 uppercase tracking-widest">{progress}% concluído</p>
          </div>
        )}
      </div>

      {showManualForm && (
        <div className="mt-10 bg-white rounded-3xl p-8 border-2 border-primary/20 shadow-xl animate-in zoom-in-95">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div>
              <h3 className="font-bold text-secondary">Introdução Manual Necessária</h3>
              <p className="text-sm text-gray-400">{errorStatus || "Não conseguimos ler a sua fatura automaticamente."}</p>
            </div>
          </div>

          <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">O seu Comercializador Atual</label>
              <input required name="fornecedor" placeholder="Ex: EDP Comercial, Galp, Endesa..." className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Consumo Mensal Médio (kWh)</label>
              <input required name="consumo" type="number" placeholder="Ex: 250" className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary/20 outline-none font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Preço p/ kWh atual (€)</label>
              <input required name="preco" type="number" step="0.0001" placeholder="Ex: 0.1650" className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary/20 outline-none font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Potência Contratada</label>
              <input name="potencia" placeholder="Ex: 6.9 kVA" className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Valor da última fatura (€)</label>
              <input name="total" type="number" step="0.01" placeholder="Ex: 55.40" className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="md:col-span-2 mt-4">
              <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-green-600 transition-all">
                Ver Melhorias de Preço
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-xs font-medium text-gray-500 border border-gray-100">
          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
          Os seus dados estão protegidos e encriptados.
        </div>
        <p className="text-xs text-gray-400 text-center max-w-md">
          Cumprimos rigorosamente o RGPD. O ficheiro enviado é processado e removido imediatamente após a análise.
        </p>
      </div>
    </div>
  );
};

export default UploadPage;
