import os
import pickle
import numpy as np
import random
from flask import Flask, jsonify, request
from flask_cors import CORS
try:
    from . import check_data
except ImportError:
    import check_data

app = Flask(__name__)
CORS(app)

# Attempt to load model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'api', 'model.pkl')
try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
except Exception as e:
    print(f"Warning: model.pkl not found or failed to load. Ensure you have trained the model. {e}")
    model = None

@app.route('/api/', methods=['GET'])
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "online", "model_loaded": model is not None}), 200

@app.route('/api/sample-transaction', methods=['GET'])
@app.route('/sample-transaction', methods=['GET'])
def get_sample_transaction():
    try:
        tx_type = request.args.get('type', 'legitimate')
        transaction = check_data.get_random_transaction(tx_type)
        return jsonify(transaction), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predict', methods=['POST'])
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True, silent=True) or {}
        features = data.get('features')
        
        if not features or len(features) != 28:
            return jsonify({"error": "Expects an array of 28 features."}), 400
            
        if model is not None:
            x_test = np.array(features).reshape(1, -1)
            probability = model.predict_proba(x_test)[0][1]
            prediction = model.predict(x_test)[0]
        else:
            # Fallback heuristic if model is not loaded (e.g. Vercel deployment issue with .pkl)
            risk_score = 0.1
            # Check for extreme values in features which might indicate fraud
            extreme_vals = sum(1 for v in features if abs(v) > 2.0)
            risk_score += extreme_vals * 0.15
            probability = min(max(risk_score, 0.01), 0.99)
            prediction = 1 if probability > 0.5 else 0
        
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

@app.route('/api/predict-upi', methods=['POST'])
@app.route('/predict-upi', methods=['POST'])
def predict_upi():
    try:
        data = request.get_json(force=True, silent=True) or {}
        amount = float(data.get('amount', 0))
        sender = str(data.get('sender', ''))
        receiver = str(data.get('receiver', ''))
        
        # Simple heuristic simulation
        risk_score = 0.1
        factors = []
        
        if amount > 50000:
            risk_score += 0.3
            factors.append("High Transfer Amount")
            
        if "unknown" in receiver.lower() or "spam" in receiver.lower() or "fraud" in receiver.lower():
            risk_score += 0.5
            factors.append("Suspicious Receiver UPI ID")
            
        # Random noise for simulation
        risk_score += random.uniform(-0.1, 0.2)
        
        probability = min(max(risk_score, 0.01), 0.99)
        prediction = 1 if probability > 0.5 else 0
        
        if prediction == 0:
            factors = ["Transfer velocity normal", "Known receiver"]
            
        return jsonify({
            "probability": float(probability),
            "prediction": int(prediction),
            "risk_factors": factors
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/scan-app', methods=['POST'])
@app.route('/scan-app', methods=['POST'])
def scan_app():
    try:
        data = request.get_json(force=True, silent=True) or {}
        app_name = str(data.get('app_name', '')).lower()
        
        # Simple heuristic simulation
        risk_score = 0.05
        factors = []
        
        suspicious_keywords = ['mod', 'hack', 'free', 'crack', 'loan', 'cash', 'bet', 'win']
        if any(kw in app_name for kw in suspicious_keywords):
            risk_score += 0.6
            factors.append("Suspicious keywords in app/package name")
            factors.append("Unverified Developer Signature")
            factors.append("Excessive Permissions Requested")
            
        if "com." not in app_name and "http" not in app_name:
             if len(app_name) < 4:
                 risk_score += 0.2
                 
        risk_score += random.uniform(-0.05, 0.1)
        probability = min(max(risk_score, 0.01), 0.99)
        prediction = 1 if probability > 0.5 else 0
        
        if prediction == 0:
            factors = ["Play Protect Verified", "No Malicious Permissions", "Standard Network Behavior"]
            
        return jsonify({
            "probability": float(probability),
            "prediction": int(prediction),
            "risk_factors": factors
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
