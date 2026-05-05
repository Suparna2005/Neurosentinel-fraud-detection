import os
import pickle
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
import check_data

app = Flask(__name__)
CORS(app)

# Attempt to load model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'model.pkl')
try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
except Exception as e:
    print(f"Warning: model.pkl not found or failed to load. Ensure you have trained the model. {e}")
    model = None

@app.route('/api/', methods=['GET'])
def health_check():
    return jsonify({"status": "online", "model_loaded": model is not None}), 200

@app.route('/api/sample-transaction', methods=['GET'])
def get_sample_transaction():
    try:
        tx_type = request.args.get('type', 'legitimate')
        transaction = check_data.get_random_transaction(tx_type)
        return jsonify(transaction), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model is not loaded."}), 500
        
    try:
        data = request.json
        features = data.get('features')
        
        if not features or len(features) != 28:
            return jsonify({"error": "Expects an array of 28 features."}), 400
            
        x_test = np.array(features).reshape(1, -1)
        
        # predict_proba returns [[prob_0, prob_1]]
        probability = model.predict_proba(x_test)[0][1]
        prediction = model.predict(x_test)[0]
        
        # Explainable AI Simulation
        feature_names = [
            "Location Improbability", "Device Fingerprint", "Velocity Metric", 
            "Behavioral Deviation", "Time Anomaly", "Network IP Risk", 
            "Amount Threshold", "Card Type Mismatch", "Past Fraud Link", "Merchant Risk"
        ]
        abs_features = [(abs(val), idx, val) for idx, val in enumerate(features)]
        abs_features.sort(key=lambda x: x[0], reverse=True)
        
        top_factors = []
        for i in range(3):
            val, idx, orig = abs_features[i]
            name = feature_names[idx] if idx < len(feature_names) else f"Pattern V{idx+1}"
            impact = "Critical" if val > 1.5 else ("High" if val > 1.0 else "Elevated")
            direction = "Spike" if orig > 0 else "Drop"
            top_factors.append(f"{name} ({impact} {direction})")
        
        return jsonify({
            "probability": float(probability),
            "prediction": int(prediction),
            "risk_factors": top_factors if prediction == 1 else ["All parameters normal"]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
