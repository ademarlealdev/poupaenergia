from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os

# Ensure local modules can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from simulation_run import get_simulation_data

app = Flask(__name__)
# Enable CORS for all routes and handle Private Network Access (PNA) preflight
CORS(app)

@app.after_request
def add_cors_headers(response):
    # Allow Private Network Access (PNA)
    if request.headers.get('Access-Control-Request-Private-Network') == 'true':
        response.headers['Access-Control-Allow-Private-Network'] = 'true'
    
    # Ensure CORS headers are robust for cross-device access
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.route('/api/simulation', methods=['GET'])
def simulation():
    power_id = request.args.get('power_id', '3')
    cycle = request.args.get('cycle', '1')
    e_ponta = request.args.get('e_ponta')
    e_cheias = request.args.get('e_cheias')
    e_vazio = request.args.get('e_vazio')
    
    data = get_simulation_data(
        power_id=power_id, 
        cycle=cycle,
        e_ponta=e_ponta,
        e_cheias=e_cheias,
        e_vazio=e_vazio
    )
    return jsonify(data)

if __name__ == '__main__':
    print("Starting local PoupaEnergia server on port 5000...")
    app.run(port=5000, debug=True)
