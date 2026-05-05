import os
import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier

def train():
    # Make some dummy data
    print("Generating dummy data...")
    # Legitimate (0)
    X_legit = np.random.normal(0, 0.5, (5000, 28))
    Y_legit = np.zeros(5000)
    
    # Fraud (1)
    X_fraud = np.random.normal(0, 2.0, (500, 28))
    Y_fraud = np.ones(500)
    
    X = np.concatenate([X_legit, X_fraud])
    Y = np.concatenate([Y_legit, Y_fraud])
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=50, random_state=42)
    model.fit(X, Y)
    
    model_dir = os.path.join(os.path.dirname(__file__), '..', 'model')
    os.makedirs(model_dir, exist_ok=True)
    
    model_path = os.path.join(model_dir, 'model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    print(f"Model saved to {model_path}")

if __name__ == '__main__':
    train()
