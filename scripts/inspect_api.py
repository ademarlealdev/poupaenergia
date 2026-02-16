import requests
import json
from datetime import datetime, timedelta

ERSE_API_URL = "https://simuladorprecos.erse.pt/connectors/simular_eletricidade/"
HEADERS_ERSE = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

payload = {
    "pageStartIndex": "0", "pageStep": "100", "caseType": "3", 
    "electSupply": "5", "cycle": "1", "electCalendar": "3",
    "electCalendarPeriodStart": datetime.now().strftime("%Y-%m-%d"),
    "electCalendarPeriodEnd": (datetime.now() + timedelta(days=365)).strftime("%Y-%m-%d"),
    "electPonta": "100", "electCheias": "0", "electVazio": "0"
}

print("Sending request...")
try:
    response = requests.post(ERSE_API_URL, headers=HEADERS_ERSE, data=payload, timeout=10)
    response.raise_for_status()
    data = response.json()
    
    print(f"Keys in root: {list(data.keys())}")
    if "Resultados" in data:
        print(f"Number of items in Resultados: {len(data['Resultados'])}")
        for i, res in enumerate(data["Resultados"]):
            ofertas = res.get("Oferta", [])
            print(f"Resultados[{i}] has {len(ofertas)} offers.")
            if len(ofertas) > 0:
                print(f"First offer: {ofertas[0].get('Comercializador')} - {ofertas[0].get('Nome')}")
    else:
        print("No 'Resultados' key found.")
        
    # Dump to file for inspection
    with open("scripts/api_dump.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Dumped to scripts/api_dump.json")

except Exception as e:
    print(f"Error: {e}")
