import requests
import json

ERSE_API_URL = "https://simuladorprecos.erse.pt/connectors/simular_eletricidade/"
HEADERS = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent": "Mozilla/5.0"
}

payload = {
    "pageStartIndex": "0", "pageStep": "100", 
    "caseType": "3", # Personalized
    "electSupply": "3", # 4.6 kVA is ID 3 in the HTML
    "cycle": "1", # Simples
    "electCalendar": "3",
    "electPonta": "1900", "electCheias": "0", "electVazio": "0",
    "filtro_NovosClientes": "1"
}

try:
    r = requests.post(ERSE_API_URL, data=payload, headers=HEADERS, timeout=15)
    with open("erse_raw_response.json", "w", encoding="utf-8") as f:
        json.dump(r.json(), f, indent=2, ensure_ascii=False)
    print("Success: Saved to erse_raw_response.json")
except Exception as e:
    print(f"Error: {e}")
