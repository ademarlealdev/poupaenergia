import requests
import socket

def check_host(hostname, port=443):
    print(f"\nScanning {hostname}:{port}...")
    try:
        ip = socket.gethostbyname(hostname)
        print(f"  DNS resolved to: {ip}")
        
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex((ip, port))
        sock.close()
        
        if result == 0:
            print("  TCP Connection: SUCCESS")
        else:
            print(f"  TCP Connection: FAILED (Errno {result})")
            return False
            
    except Exception as e:
        print(f"  DNS/Socket Error: {e}")
        return False
    return True

def check_http(url):
    print(f"Testing HTTP GET {url}...")
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        resp = requests.get(url, headers=headers, timeout=10)
        print(f"  Status: {resp.status_code}")
        print(f"  Server: {resp.headers.get('Server', 'Unknown')}")
    except Exception as e:
        print(f"  HTTP Error: {e}")

print("--- DIAGNOSTIC START ---")
check_http("https://www.google.com") # Control
check_host("simulador.precos.erse.pt")
check_http("https://simulador.precos.erse.pt/")
check_http("https://www.erse.pt/")
print("\n--- DIAGNOSTIC END ---")
