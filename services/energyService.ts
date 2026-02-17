
import { BillData, ComparisonResult, Provider } from '../types';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from './supabaseClient';

const genAI = new GoogleGenerativeAI((import.meta as any).env.VITE_GEMINI_API_KEY || '');

export const extractBillData = async (file: File): Promise<BillData> => {
  // Convert file to base64
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const base64Data = await readFileAsBase64(file);

  const prompt = `
    Analyze this electricity bill and extract the following information in JSON format:
    - fornecedorAtual (string, the name of the energy provider)
    - consumoMensalKwh (number, TOTAL monthly consumption in kWh. Sum all 'Termo de Energia' consumption lines. Do NOT count 'Termo de Potência' or days.)
    - potenciaContratada (string, e.g. "6.9 kVA")
    - precoKwh (number, the effective UNIT price per kWh in Euros. Look for 'Termo de Energia' or 'Energia'. If there is a discounted price (e.g. 'Preço com desconto'), use the DISCOUNTED unit price. Do NOT sum unit prices from multiple lines. Do NOT average them manually unless they are different rates (e.g. Empty/Full). If lines have the same price, just use that price. Example: if 0.1697 is base and 0.1323 is discounted, return 0.1323)
    - totalFatura (number, total amount to pay in Euros)
    - dataFatura (string, the date of the invoice in YYYY-MM-DD format. Look for 'Data de Emissão', 'Data', or similar.)

    Return ONLY the JSON.
  `;

  try {
    // Attempt with Gemini 2.0 Flash (Newest)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(cleanedText);

    // Date Validation
    if (parsedData.dataFatura) {
      const invoiceDate = new Date(parsedData.dataFatura);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      if (invoiceDate < threeMonthsAgo) {
        throw new Error("INVOICE_TOO_OLD");
      }
    }

    return parsedData as BillData;

  } catch (error: any) {
    console.error("Gemini API failure:", error);

    if (error.message === "INVOICE_TOO_OLD") {
      throw error; // Re-throw specifically
    }

    // Throw a specific error for quota/not found so the UI can offer manual entry
    const isQuota = error.message?.includes("429") || error.message?.includes("quota");
    const isNotFound = error.message?.includes("404") || error.message?.includes("not found");

    if (isQuota || isNotFound) {
      throw new Error("AI_LIMIT_EXCEEDED");
    }

    throw new Error("Não foi possível analisar a fatura. Por favor tente novamente ou preencha os dados manualmente.");
  }
};

export const compareTariffs = async (currentData: BillData): Promise<ComparisonResult[]> => {
  const { data: tariffs, error } = await supabase
    .from('tariffs')
    .select('*')
    .lte('valid_from', new Date().toISOString())
    .gte('valid_to', new Date().toISOString());

  if (error || !tariffs) {
    console.error("Error fetching tariffs:", error);
    return [];
  }

  const currentAnnualCost = currentData.consumoMensalKwh * currentData.precoKwh * 12;

  return tariffs.map(t => {
    const provider: Provider = {
      nome: t.provider_name,
      precoKwh: t.price_kwh,
      logo: t.logo_url
    };

    const monthlyCost = currentData.consumoMensalKwh * provider.precoKwh;
    const annualCost = monthlyCost * 12;
    const annualSaving = currentAnnualCost - annualCost;
    const monthlySaving = annualSaving / 12;
    const savingPercentage = (annualSaving / currentAnnualCost) * 100;

    return {
      provider,
      monthlyCost,
      annualCost,
      monthlySaving,
      annualSaving,
      savingPercentage
    };
  }).sort((a, b) => b.annualSaving - a.annualSaving);
};

export const submitChangeRequest = async (data: any): Promise<boolean> => {
  const { error } = await supabase
    .from('change_requests')
    .insert([data]);

  if (error) {
    console.error('Error submitting change request:', error);
    return false;
  }
  return true;
};

export const getTariffs = async (): Promise<Provider[]> => {
  const { data: tariffs, error } = await supabase
    .from('tariffs')
    .select('*')
    .lte('valid_from', new Date().toISOString())
    .gte('valid_to', new Date().toISOString())
    .order('price_kwh', { ascending: true });

  if (error || !tariffs) {
    console.error("Error fetching tariffs:", error);
    return [];
  }

  return tariffs.map(t => ({
    nome: t.provider_name,
    precoKwh: t.price_kwh,
    logo: t.logo_url
  }));
};
