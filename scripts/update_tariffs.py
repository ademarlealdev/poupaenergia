import os
import asyncio
import requests
import json
import argparse
import random
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
# Resolve path relative to this script file
script_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(script_dir, '../.env.local')
load_dotenv(dotenv_path=env_path)

# Supabase setup
url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    print("Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env.local")
    exit(1)

# API Endpoint for Supabase REST access
supabase_rest_url = f"{url}/rest/v1/tariffs"
supabase_headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

# ERSE API Constants
ERSE_API_URL = "https://simuladorprecos.erse.pt/connectors/simular_eletricidade/"
HEADERS_ERSE = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def generate_mock_data():
    """Generates sample tariff data for testing/fallback."""
    providers = [
        "EDP Comercial", "Endesa", "Iberdrola", "Galp", "Goldenergy", 
        "Plenitude", "Repsol", "SU Eletricidade", "MEO Energia"
    ]
    offers = []
    for provider in providers:
        offers.append({
            "Comercializador": provider,
            "Nome": f"Tarifa Mock {datetime.now().year}",
            "PrecoTermoenergia": f"0.{random.randint(1200, 1800)}", # 0.12 - 0.18
        })
    return offers

async def update_tariffs(mock_mode=False):
    if mock_mode:
        print("⚠️  MOCK MODE: Generating sample data (ERSE API bypassed)...")
        offers = generate_mock_data()
    else:
        print("Fetching commercial offers directly from ERSE Simulator API...")
        
        # Payload derived from pyerse logic
        # Simulating 6.9 kVA (Index 5 in POTENCIA list), Simples Cycle
        payload = {
            "pageStartIndex": "0",
            "pageStep": "200", 
            "caseType": "3",  # Residencial
            "electSupply": "5", # 6.9 kVA
            "cycle": "1", # Simples
            "electCalendar": "3",
            "electCalendarPeriodStart": datetime.now().strftime("%Y-%m-%d"),
            "electCalendarPeriodEnd": (datetime.now() + timedelta(days=365)).strftime("%Y-%m-%d"),
            "electPonta": "100", # Dummy values to trigger simulation
            "electCheias": "0",
            "electVazio": "0",
            # Filters matching user screenshot and HTML analysis
            "filtro_NovosClientes": "1", # Essential for cheapest offers
            "filtro_Fidelizacao": "1",
            "filtro_TipoOfertaELE": "3", # 3 = Fixed Price
        }

        try:
            response = requests.post(ERSE_API_URL, headers=HEADERS_ERSE, data=payload, timeout=20)
            response.raise_for_status()
            
            result = response.json()
            
            # Check if we have results
            if "Resultados" not in result or not result["Resultados"]:
                print("No results found from ERSE.")
                return

            # Extract offers from each result block
            offers = []
            for res in result["Resultados"]:
                offers.extend(res.get("Oferta", []))
                
        except Exception as e:
            print(f"❌ Error contacting ERSE API: {e}")
            print("Tip: Use --mock to test the database update without the API.")
            return

    print(f"Found {len(offers)} offers. Processing best prices...")
    
    # Process offers in memory to find the BEST (lowest) price per provider
    best_offers = {}
    
    for offer in offers:
        try:
            provider_name = offer.get("Comercializador", "").strip()
            price_str = str(offer.get("PrecoTermoenergia", "0")).replace(",", ".")
            price_kwh = float(price_str) if price_str else 0.0
            
            if not provider_name or price_kwh == 0:
                continue

            # Filter for FIXED PRICE offers only (as requested by user)
            # "PrecosFixos" is "1" for fixed, "0" for indexed
            if offer.get("PrecosFixos") != "1":
                continue

            # Logic to keep the lowest price
            if provider_name not in best_offers:
                best_offers[provider_name] = price_kwh
            else:
                if price_kwh < best_offers[provider_name]:
                    best_offers[provider_name] = price_kwh
                    
        except ValueError:
            continue

    print(f"Identified {len(best_offers)} unique providers. Syncing to database...")
    
    success_count = 0
    
    for provider_name, price_kwh in best_offers.items():
        try:
            # 1. Check if record exists
            query_url = f"{supabase_rest_url}?provider_name=eq.{requests.utils.quote(provider_name)}"
            get_res = requests.get(query_url, headers=supabase_headers)
            
            existing_records = []
            if get_res.status_code == 200:
                existing_records = list(get_res.json())

            db_payload = {
                'provider_name': provider_name,
                'price_kwh': price_kwh,
                'valid_from': datetime.now().strftime("%Y-%m-%d"),
                'valid_to': '2026-12-31'
            }

            if existing_records:
                # Update the first record found
                target_id = existing_records[0]['id']
                patch_url = f"{supabase_rest_url}?id=eq.{target_id}"
                
                patch_res = requests.patch(patch_url, json=db_payload, headers=supabase_headers)
                
                if patch_res.status_code in [200, 204]:
                    print(f"Updated: {provider_name:<20} -> {price_kwh:.4f} €/kWh")
                    success_count += 1
                else:
                    print(f"Failed to patch {provider_name}: {patch_res.status_code} - {patch_res.text}")

                # 2. Cleanup duplicates if any
                if len(existing_records) > 1:
                    print(f"  ⚠️ Found {len(existing_records)} duplicates for {provider_name}. Cleaning up...")
                    for dup in existing_records[1:]:
                        del_url = f"{supabase_rest_url}?id=eq.{dup['id']}"
                        requests.delete(del_url, headers=supabase_headers)
            else:
                # Insert new record
                post_res = requests.post(supabase_rest_url, json=db_payload, headers=supabase_headers)
                
                if post_res.status_code in [200, 201]:
                    print(f"Inserted: {provider_name:<20} -> {price_kwh:.4f} €/kWh")
                    success_count += 1
                else:
                    print(f"Failed to insert {provider_name}: {post_res.status_code} - {post_res.text}")
                
        except Exception as e:
            print(f"Error processing {provider_name}: {e}")
            continue

    print(f"Update complete! Successfully processed {success_count} providers.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update electricity tariffs from ERSE.")
    parser.add_argument("--mock", action="store_true", help="Use mock data instead of calling ERSE API")
    args = parser.parse_args()
    
    asyncio.run(update_tariffs(mock_mode=args.mock))
