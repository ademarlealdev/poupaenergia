import requests
import json
import os

ERSE_API_URL = "https://simuladorprecos.erse.pt/connectors/simular_eletricidade/"
HEADERS = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent": "Mozilla/5.0"
}

def get_simulation_data(power_id="3", cycle="1", e_ponta=None, e_cheias=None, e_vazio=None):
    """
    Fetches simulation data from ERSE with dynamic parameters.
    - power_id: ERSE ID (e.g., "3" for 4.6 kVA, "4" for 5.75 kVA)
    - cycle: "1" (Simples), "2" (Bi-Horário), "3" (Tri-Horário)
    - e_ponta, e_cheias, e_vazio: Optional custom consumption values
    """
    
    # Consumption mapping based on user requirements (defaults)
    if e_ponta is None:
        if cycle == "1": # Simples
            e_ponta = "1900"
        elif cycle == "2": # Bi-Horário
            e_ponta = "1140" # Fora de Vazio
        elif cycle == "3": # Tri-Horário
            e_ponta = "325"  # Ponta
        else:
            e_ponta = "0"
            
    if e_cheias is None:
        if cycle == "2": # Bi-Horário
            e_cheias = "760" # Vazio
        elif cycle == "3": # Tri-Horário
            e_cheias = "815" # Cheias
        else:
            e_cheias = "0"
            
    if e_vazio is None:
        if cycle == "3": # Tri-Horário
            e_vazio = "760"  # Vazio
        else:
            e_vazio = "0"

    # Total consumption for metadata
    total_consumption = float(e_ponta) + float(e_cheias) + float(e_vazio)

    payload = {
        "pageStartIndex": "0", "pageStep": "100", 
        "caseType": "3", # Personalized
        "electSupply": str(power_id),
        "cycle": str(cycle),
        "electCalendar": "3",
        "electPonta": e_ponta, 
        "electCheias": e_cheias, 
        "electVazio": e_vazio,
        "filtro_NovosClientes": "1"
    }

    try:
        r = requests.post(ERSE_API_URL, data=payload, headers=HEADERS, timeout=15)
        if r.status_code != 200:
            return {"error": f"ERSE API returned status {r.status_code}"}
        
        data = r.json()
        if "Resultados" not in data:
            return {"error": "No Results found in ERSE response"}
            
        # Get labels for power and cycle for metadata
        power_labels = {
            "0": "1.15", "1": "2.3", "2": "3.45", "3": "4.6", 
            "4": "5.75", "5": "6.9", "6": "10.35", "7": "13.8", 
            "8": "17.25", "9": "20.7"
        }
        power_val = float(power_labels.get(str(power_id), "4.6"))

        results = []
        for res in data["Resultados"]:
            offer_list = res.get("Oferta", [])
            if not offer_list: continue
            
            first_offer = offer_list[0]
            
            def parse_price(val):
                if not val: # Handle None, empty string, etc.
                    return 0.0
                if isinstance(val, str):
                    try:
                        return float(val.replace(",", "."))
                    except ValueError:
                        return 0.0
                return float(val or 0)

            results.append({
                "comercializador": first_offer.get("Comercializador", "Desconhecido"),
                "nome_oferta": first_offer.get("Nome", "N/A"),
                "potencia_contratada": power_val,
                "consumo_kwh": total_consumption,
                "termo_fixo_diario": parse_price(first_offer.get("PrecoTermoFixo", 0)),
                "energia_unitario": parse_price(first_offer.get("PrecoTermoenergia", 0)),
                "p_ponta": parse_price(first_offer.get("PrecoTermoenergia", 0)),
                "p_cheias": parse_price(first_offer.get("PrecoTermoenergia2", 0)),
                "p_vazio": parse_price(first_offer.get("PrecoTermoenergia3", 0)),
                "ciclo": first_offer.get("TipoContagem", str(cycle)),
                "termo_fixo_anual": parse_price(res.get("PrecoAcesso", 0)),
                "energia_anual": parse_price(res.get("PrecoEnergia", 0)),
                "taxas_impostos_anual": parse_price(res.get("PrecoTaxasImpostos", 0)),
                "faturacao_total_anual": parse_price(res.get("PrecoTotal", 0)),
                "pagamento": first_offer.get("ModoPagamento", "N/A"),
                "digital": first_offer.get("TipoFaturacao", "N/A"),
                "logotipo": first_offer.get("Logotipo", ""),
            })
        
        # Sort by total price
        results.sort(key=lambda x: x["faturacao_total_anual"])
        return results

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Test run
    print(json.dumps(get_simulation_data(), indent=2))
