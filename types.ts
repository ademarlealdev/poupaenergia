
export interface BillData {
  fornecedorAtual: string;
  consumoMensalKwh: number;
  potenciaContratada: string;
  precoKwh: number;
  totalFatura: number;
}

export interface Provider {
  nome: string;
  precoKwh: number;
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
}
