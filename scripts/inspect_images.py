import json

def search_images(data, path=""):
    if isinstance(data, dict):
        for k, v in data.items():
            if isinstance(v, str):
                if any(x in v.lower() for x in ['.jpg', '.png', '.svg', 'image', 'logo']):
                    print(f"Found match at {path}.{k}: {v}")
            elif isinstance(v, (dict, list)):
                search_images(v, f"{path}.{k}")
    elif isinstance(data, list):
        for i, item in enumerate(data):
            search_images(item, f"{path}[{i}]")

try:
    with open('scripts/api_dump.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        print("Searching for image-like fields...")
        search_images(data)
except Exception as e:
    print(f"Error: {e}")
