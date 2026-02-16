from flask import Flask, jsonify, request
from flask_cors import CORS
import asyncio
import sys
import os

# Ensure local modules can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from update_tariffs import update_tariffs

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/update-tariffs', methods=['POST'])
def trigger_update():
    mock_mode = request.args.get('mock', 'false').lower() == 'true'
    
    print(f"Received update request. Mock mode: {mock_mode}")
    
    try:
        # Run the async update function
        asyncio.run(update_tariffs(mock_mode=mock_mode))
        return jsonify({"success": True, "message": "Tariff update completed successfully."}), 200
    except Exception as e:
        print(f"Error executing script: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    print("Starting local PoupaEnergia server on port 5000...")
    print("Endpoint: POST http://localhost:5000/update-tariffs?mock=true")
    app.run(port=5000, debug=True)
