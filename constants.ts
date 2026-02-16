
import { Provider } from './types';

export const PROVIDERS_MOCK: Provider[] = [
  { nome: 'EDP Comercial', precoKwh: 0.190, logo: 'https://picsum.photos/40/40?random=1' },
  { nome: 'Endesa', precoKwh: 0.170, logo: 'https://picsum.photos/40/40?random=2' },
  { nome: 'Iberdrola', precoKwh: 0.168, logo: 'https://picsum.photos/40/40?random=3' },
  { nome: 'Galp Energia', precoKwh: 0.175, logo: 'https://picsum.photos/40/40?random=4' },
  { nome: 'Goldenergy', precoKwh: 0.165, logo: 'https://picsum.photos/40/40?random=5' },
];

export const MOCK_EXTRACTION_SUCCESS = {
  fornecedorAtual: "EDP Comercial",
  consumoMensalKwh: 320,
  potenciaContratada: "6.9 kVA",
  precoKwh: 0.182,
  totalFatura: 78.50
};
