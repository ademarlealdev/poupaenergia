
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
    - cicloHorario (string, MUST be one of: "Simples", "Bi-horária", "Tri-horária". Identify based on the periods shown - e.g. "Vazio/Fora Vazio" means Bi-horária.)
    - consumoMensalKwh (number, TOTAL monthly consumption in kWh.)
    - consumoPonta (number, optional. Consumption in 'Ponta' period.)
    - consumoCheias (number, optional. Consumption in 'Cheias' period. For Bi-horária, map 'Fora de Vazio' here.)
    - consumoVazio (number, optional. Consumption in 'Vazio' period.)
    - potenciaContratada (string, e.g. "6.9 kVA")
    - termoPotencia (number, the DAILY fixed cost for power in Euros.)
    - precoKwh (number, the effective UNIT price per kWh in Euros. If dynamic or multiple lines, use the most representative one.)
    - totalFatura (number, total amount to pay in Euros)
    - dataFatura (string, YYYY-MM-DD format.)

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


  const currentAnnualCost = (currentData.consumoMensalKwh * currentData.precoKwh * 12) + ((currentData.termoPotencia || 0) * 365);

  // Parse contracted power (e.g., "6.9 kVA" -> 6.9)
  const powerStr = currentData.potenciaContratada.toLowerCase().replace('kva', '').replace(',', '.').trim();
  const power = parseFloat(powerStr) || 6.9;

  // Determine Cycle Type (Default Simples)
  // Logic: We don't extract cycle explicitly yet, so we default to Simples unless user overrides (which we will add support for later in UI)
  // For now, comparison uses "Simples" or tries to matching existing if possible?
  // User asked for "filters for power and cycle in Tariffs tab", so comparison logic might stay simple for now unless user edits it.
  // BUT user said "na simulação à ERSE... opção horária: simples, bi-horária...".
  // So we should try to support it. 
  // Since we only have total consumption in BillData, we will assume a profile for Bi/Tri.

  // Default to Simples for automatic comparison for now, until we extract cycle from bill.
  const cycle: "Simples" | "Bi-horária" | "Tri-horária" = currentData.cicloHorario || "Simples";

  // Fetch tariffs for this specific power level and cycle
  const tariffs = await getTariffs(power, cycle);

  return tariffs.map(provider => {
    // Cost Calculation based on Cycle
    let monthlyEnergyCost = 0;

    if (cycle === 'Bi-horária' && provider.precoKwh2) {
      // Bi-horária: 
      // Kwh (price_kwh) = Fora de Vazio (Cheias + Ponta)
      // Kwh2 (price_kwh_2) = Vazio

      const vazio = currentData.consumoVazio || (currentData.consumoMensalKwh * 0.4);
      // If we have specific Cheias/Ponta, sum them for Fora Vazio. If not, use remainder of Vazio or default 60%
      const foraVazio = (currentData.consumoCheias || 0) + (currentData.consumoPonta || 0) || (currentData.consumoMensalKwh - vazio);

      monthlyEnergyCost = (foraVazio * provider.precoKwh) + (vazio * provider.precoKwh2);

    } else if (cycle === 'Tri-horária' && provider.precoKwh2 && provider.precoKwh3) {
      // Tri-horária:
      // Kwh (price_kwh) = Ponta
      // Kwh2 (price_kwh_2) = Cheias
      // Kwh3 (price_kwh_3) = Vazio

      const ponta = currentData.consumoPonta || (currentData.consumoMensalKwh * 0.2);
      const cheias = currentData.consumoCheias || (currentData.consumoMensalKwh * 0.5);
      const vazio = currentData.consumoVazio || (currentData.consumoMensalKwh * 0.3);

      monthlyEnergyCost = (ponta * provider.precoKwh) + (cheias * provider.precoKwh2) + (vazio * provider.precoKwh3);

    } else {
      // Simples
      monthlyEnergyCost = currentData.consumoMensalKwh * provider.precoKwh;
    }

    const monthlyCost = monthlyEnergyCost + (provider.termoPotencia * 30.42);
    const annualCost = (monthlyEnergyCost * 12) + (provider.termoPotencia * 365);

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
  // Map camelCase to snake_case for database
  const dbData = {
    nome: data.nome,
    nif: data.nif,
    morada: data.morada,
    cpe: data.cpe,
    iban: data.debitoDireto ? data.iban : null, // Only send IBAN if direct debit is active
    telefone: data.telefone,
    email: data.email,
    fornecedor: data.fornecedor,
    fatura_eletronica: data.faturaEletronica,
    debito_direto: data.debitoDireto
  };

  const { error } = await supabase
    .from('change_requests')
    .insert([dbData]);

  if (error) {
    console.error('Error submitting change request:', error);
    return false;
  }
  return true;
};

export const getTariffs = async (contractedPower?: number, cycleType: string = 'Simples'): Promise<Provider[]> => {
  let query = supabase
    .from('tariffs')
    .select('*')
    .lte('valid_from', new Date().toISOString())
    .gte('valid_to', new Date().toISOString())
    .order('price_kwh', { ascending: true });

  if (contractedPower) {
    query = query.eq('contracted_power', contractedPower);
  }

  if (cycleType) {
    query = query.eq('cycle_type', cycleType);
  }

  const { data: tariffs, error } = await query;

  if (error || !tariffs) {
    console.error("Error fetching tariffs:", error);
    return [];
  }

  return tariffs.map(t => ({
    nome: t.provider_name,
    precoKwh: t.price_kwh,
    precoKwh2: t.price_kwh_2,
    precoKwh3: t.price_kwh_3,
    termoPotencia: t.standing_charge,
    logo: t.logo_url
  }));
};
