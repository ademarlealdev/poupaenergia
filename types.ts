
export interface BillData {
  fornecedorAtual: string;
  consumoMensalKwh: number;
  potenciaContratada: string;
  precoKwh: number;
  termoPotencia: number;
  totalFatura: number;
  cicloHorario?: 'Simples' | 'Bi-horária' | 'Tri-horária';
  consumoPonta?: number;
  consumoCheias?: number;
  consumoVazio?: number;
  analysisTime?: number;
}

export interface Provider {
  nome: string;
  precoKwh: number;
  precoKwh2?: number; // Preco Cheias/Vazio (dependent on cycle)
  precoKwh3?: number; // Preco Vazio (dependent on cycle)
  termoPotencia: number;
  logo?: string;
}

export interface ComparisonResult {
  provider: Provider;
  monthlyCost: number;
  annualCost: number;
  monthlySaving: number;
  annualSaving: number;
  savingPercentage: number;
}

export interface ChangeFormData {
  nome: string;
  nif: string;
  morada: string;
  cpe: string;
  iban?: string;
  telefone: string;
  email: string;
  fornecedor: string;
  faturaEletronica: boolean;
  debitoDireto: boolean;
}
