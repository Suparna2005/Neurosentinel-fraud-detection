import os
import pandas as pd
import random
import numpy as np

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'creditcard.csv')

def get_random_transaction(tx_type='legitimate'):
    """
    Randomly subsamples from the dataset based on transaction type.
    """
    if not os.path.exists(DATA_PATH):
        # Return a dummy generated row if data is not available
        return _generate_dummy_transaction(tx_type)
        
    try:
        df = pd.read_csv(DATA_PATH)
        # Class 1 is fraud, Class 0 is legitimate
        target_class = 1 if tx_type == 'fraud' else 0
        df_filtered = df[df['Class'] == target_class]
        
        if df_filtered.empty:
            return _generate_dummy_transaction(tx_type)
            
        sample = df_filtered.sample(1).iloc[0]
        
        # Extract features V1-V28
        features = [sample[f'V{i}'] for i in range(1, 29)]
        amount = sample['Amount'] if 'Amount' in sample else random.uniform(5.0, 500.0)
        
        return {
            "features": features,
            "amount": float(amount),
            "type": tx_type
        }
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return _generate_dummy_transaction(tx_type)

def _generate_dummy_transaction(tx_type):
    """Fallback method to generate a dummy transaction when CSV is missing."""
    import random
    
    # Fraud transactions might have more extreme values
    scale = 2.0 if tx_type == 'fraud' else 0.5
    
    features = [random.gauss(0, scale) for _ in range(28)]
    amount = random.uniform(10.0, 1000.0)
    
    return {
        "features": features,
        "amount": round(amount, 2),
        "type": tx_type
    }
