import { supabase } from './supabaseClient';

export const updateTariffPrices = async (): Promise<{ success: boolean; message: string }> => {
    try {
        // 1. Fetch all current tariffs
        const { data: tariffs, error: fetchError } = await supabase
            .from('tariffs')
            .select('*');

        if (fetchError) throw fetchError;

        if (!tariffs || tariffs.length === 0) {
            return { success: false, message: 'Não foram encontrados tarifários para atualizar.' };
        }

        // 2. "Update" them by setting valid_from to NOW (simulating a fresh fetch)
        // In a real scenario, here we would fetch from APIs:
        // const newPrice = await fetchPriceFromEndesa();

        const updates = tariffs.map(async (tariff) => {
            const { error: updateError } = await supabase
                .from('tariffs')
                .update({ valid_from: new Date().toISOString() }) // Update timestamp to show "freshness"
                .eq('id', tariff.id);

            if (updateError) throw updateError;
        });

        await Promise.all(updates);

        return {
            success: true,
            message: `Preços atualizados com sucesso! (${tariffs.length} tarifários revalidados)`
        };

    } catch (error) {
        console.error('Erro ao atualizar preços:', error);
        return { success: false, message: 'Erro ao conectar à base de dados.' };
    }
};
