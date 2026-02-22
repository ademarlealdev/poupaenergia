from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os

# Ensure local modules can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from simulation_run import get_simulation_data

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

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
