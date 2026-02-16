import json

try:
    with open('scripts/api_dump.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Total results: {len(data.get('Resultados', []))}")
    
    edp_offers = []
    
    for res in data.get('Resultados', []):
        for offer in res.get('Oferta', []):
            if "EDP" in offer.get("Comercializador", ""):
                 edp_offers.append(offer)

    print(f"Found {len(edp_offers)} EDP offers.")
    
    for offer in edp_offers:
        name = offer.get("Nome")
        price = offer.get("PrecoTermoenergia")
        fixed = offer.get("PrecosFixos")
        indexed = offer.get("PrecosIndexados")
        print(f"Offer: {name} | Price: {price} | Fixed: {fixed} | Indexed: {indexed}")

except Exception as e:
    print(f"Error: {e}")
