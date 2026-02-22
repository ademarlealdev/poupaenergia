import asyncio
import sys
import os

# Ensure current dir is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import requests
import os
import asyncio
from dotenv import load_dotenv
from update_tariffs import update_tariffs
import json

if __name__ == "__main__":
    print(f"🚀 Probing ERSE IDs 1-5 to find price 0.3478...")
    
    url = "https://simuladorprecos.erse.pt/connectors/simular_eletricidade/"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0"
    }

    for supply_id in range(1, 7):
        payload = {
            "pageStartIndex": "0", "pageStep": "100", "caseType": "1", # Simples
            "electSupply": str(supply_id),
            "cycle": "1", # Simples
            "electCalendar": "3",
            "electPonta": "0", "electCheias": "0", "electVazio": "0",
            # "filtro_NovosClientes": "1", "filtro_Fidelizacao": "1", "filtro_TipoOfertaELE": "3"
            # "filtro_NovosClientes": "1", "filtro_Fidelizacao": "1", "filtro_TipoOfertaELE": "3"
            # TRYING WITHOUT FILTERS OR WITH DIFFERENT VALUES
        }
        try:
            r = requests.post(url, data=payload, headers=headers)
            print(f"ID {supply_id} -> Status: {r.status_code}")
            
            # Parsing Logic
            data = None
            try:
                data = r.json()
            except:
                pass
            
            if isinstance(data, str):
                try: data = json.loads(data)
                except: pass
            
            if isinstance(data, dict):
                if 'd' in data: data = data['d']
                elif 'data' in data: data = data['data']
                elif 'Resultados' in data: data = data['Resultados'] # FOUND IT!
                
                if isinstance(data, str):
                    try: data = json.loads(data)
                    except: pass

            if not isinstance(data, list):
                print(f"ID {supply_id} -> Unexpected format: {type(data)}")
                if isinstance(data, dict): print(f"Keys: {list(data.keys())}")
                continue

            # Process List
            clean_list = []
            for item in data:
                if isinstance(item, dict):
                    clean_list.append(item)
                elif isinstance(item, str):
                    try: clean_list.append(json.loads(item))
                    except: pass
            
                # Simplify structure for easier access
                simplified_offers = []
                for o in clean_list:
                    provider = "Unknown"
                    name = "Unknown"
                    price = "N/A"
                    
                    # Check in Oferta list
                    if 'Oferta' in o and isinstance(o['Oferta'], list) and len(o['Oferta']) > 0:
                        first_offer = o['Oferta'][0]
                        if 'Comercializador' in first_offer:
                            provider = first_offer['Comercializador']
                        
                        name = o.get('Nome', first_offer.get('Nome', 'Unknown'))
                        price = o.get('PrecoTermoFixo', first_offer.get('PrecoTermoFixo', 'N/A'))
                    
                    simplified_offers.append({'provider': provider, 'name': name, 'price': price})

                # Debug: Print all provider names
                providers = set(o['provider'] for o in simplified_offers)
                print(f"ID {supply_id} -> Providers found: {list(providers)[:10]}")

                # Search for target price
                for o in simplified_offers:
                    try:
                        p_val = float(o['price'].replace(',', '.'))
                        if 0.34 <= p_val <= 0.35:
                            print(f"🎯 MATCH FOUND! ID {supply_id} -> Provider: {o['provider']} | Name: {o['name']} | Price: {o['price']}")
                    except:
                        pass
                        
            else:
                print(f"ID {supply_id} -> Empty List")
            
        except Exception as e:
            print(f"ID {supply_id} -> Error: {e}") 
