import os
import csv
import random

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'creditcard.csv')

def get_random_transaction(tx_type='legitimate'):
    """
    Randomly subsamples from the dataset based on transaction type.
    """
    if not os.path.exists(DATA_PATH):
        # Return a dummy generated row if data is not available
        return _generate_dummy_transaction(tx_type)
        
    try:
        target_class = '1' if tx_type == 'fraud' else '0'
        matching_rows = []
        
        with open(DATA_PATH, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f)
            header = next(reader)
            
            # Find indices dynamically
            class_idx = header.index('Class') if 'Class' in header else len(header) - 1
            v_indices = [header.index(f'V{i}') for i in range(1, 29)] if 'V1' in header else list(range(1, 29))
            amount_idx = header.index('Amount') if 'Amount' in header else len(header) - 2
            
            for row in reader:
                if len(row) > class_idx and row[class_idx] == target_class:
                    matching_rows.append(row)
                    
        if not matching_rows:
            return _generate_dummy_transaction(tx_type)
            
        sample = random.choice(matching_rows)
        
        # Extract features V1-V28
        features = [float(sample[i]) for i in v_indices]
        amount = float(sample[amount_idx]) if amount_idx < len(sample) else random.uniform(5.0, 500.0)
        
        return {
            "features": features,
            "amount": amount,
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
