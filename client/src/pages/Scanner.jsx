import React, { useState } from 'react';
import axios from 'axios';
import { ScanSearch, AlertTriangle, ShieldCheck, DownloadCloud, Smartphone, CreditCard, AppWindow } from 'lucide-react';

const Scanner = () => {
  const [scanType, setScanType] = useState('card'); // 'card', 'upi', 'app'
  
  // Card Scan State
  const [transaction, setTransaction] = useState(null);
  
  // UPI Scan State
  const [upiData, setUpiData] = useState({ amount: '', sender: '', receiver: '' });
  
  // App Scan State
  const [appData, setAppData] = useState({ app_name: '' });

  // Shared State
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  // Switch Tab Handler
  const handleTabChange = (type) => {
    setScanType(type);
    setResult(null);
  };

  // 1. User -> loads sample transaction (Card)
  const loadSample = async (type) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.get(`/api/sample-transaction?type=${type}`);
      setTransaction(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load sample transaction. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Load sample UPI
  const loadSampleUpi = (type) => {
    setResult(null);
    if (type === 'legitimate') {
      setUpiData({ amount: '500', sender: 'john@upi', receiver: 'grocery@upi' });
    } else {
      setUpiData({ amount: '85000', sender: 'john@upi', receiver: 'unknown_spam_user@ybl' });
    }
  };

  // Load sample App
  const loadSampleApp = (type) => {
    setResult(null);
    if (type === 'legitimate') {
      setAppData({ app_name: 'com.whatsapp.messenger' });
    } else {
      setAppData({ app_name: 'Free Cash Loan Mod Hack APK' });
    }
  };

  // 2. User -> Clicks scan
  const performScan = async () => {
    setScanning(true);
    setResult(null);
    const startTime = performance.now();
    let endpoint = '/api/predict';
    let payload = {};

    if (scanType === 'card') {
      if (!transaction) { setScanning(false); return; }
      payload = { features: transaction.features };
    } else if (scanType === 'upi') {
      if (!upiData.amount || !upiData.receiver) { alert("Please enter Amount and Receiver UPI"); setScanning(false); return; }
      endpoint = '/api/predict-upi';
      payload = upiData;
    } else if (scanType === 'app') {
      if (!appData.app_name) { alert("Please enter App Name / Package"); setScanning(false); return; }
      endpoint = '/api/scan-app';
      payload = appData;
    }

    try {
      const res = await axios.post(endpoint, payload);
      const endTime = performance.now();
      const speedMs = Math.round(endTime - startTime);
      
      const newResult = res.data;
      setResult(newResult);
      
      // Save to localStorage for Analytics
      try {
        const existingScans = JSON.parse(localStorage.getItem('neuro_sentinel_scans') || '[]');
        const newRecord = {
          id: existingScans.length + 1,
          probability: newResult.probability * 100, // store as percentage 0-100
          prediction: newResult.prediction,
          type: scanType, // 'card', 'upi', 'app'
          speed: speedMs,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('neuro_sentinel_scans', JSON.stringify([...existingScans, newRecord]));
        // Dispatch custom event to let other tabs/components know if needed
        window.dispatchEvent(new Event('scanAdded'));
      } catch (e) {
        console.error("Local storage error", e);
      }
      
    } catch (err) {
      console.error(err);
      alert("Error performing scan.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="fade-in">
      <h1>Multi-Vector Scanner</h1>
      <p className="subtitle">Execute realtime ML predictions on various threat vectors.</p>

      {/* Tabs */}
      <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
        <button className={`btn ${scanType === 'card' ? '' : 'btn-outline'}`} onClick={() => handleTabChange('card')} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center'}}>
          <CreditCard size={18} /> Card Transaction
        </button>
        <button className={`btn ${scanType === 'upi' ? '' : 'btn-outline'}`} onClick={() => handleTabChange('upi')} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center'}}>
          <Smartphone size={18} /> UPI Transfer
        </button>
        <button className={`btn ${scanType === 'app' ? '' : 'btn-outline'}`} onClick={() => handleTabChange('app')} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center'}}>
          <AppWindow size={18} /> App Security
        </button>
      </div>

      <div className="grid-2">
        {/* Left Column: Data Input */}
        <div className="glass-card">
          <h2 style={{fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <DownloadCloud size={20} /> Data Import / Entry
          </h2>
          
          {scanType === 'card' && (
            <>
              <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem'}}>
                Pull a random historical record from the dataset to simulate real-time ingestion.
              </p>
              <div style={{display: 'flex', gap: '1rem'}}>
                <button className="btn" onClick={() => loadSample('legitimate')} disabled={loading || scanning}>
                  Pull Legitimate TX
                </button>
                <button className="btn" style={{background: 'var(--danger)'}} onClick={() => loadSample('fraud')} disabled={loading || scanning}>
                  Pull Fraudulent TX
                </button>
              </div>

              {transaction && (
                <div style={{marginTop: '2rem'}}>
                  <h3 style={{fontSize: '1rem', color: 'var(--text-muted)'}}>Loaded Features (V1-V28)</h3>
                  <div className="features-grid">
                    {transaction.features.slice(0, 12).map((val, idx) => (
                      <div key={idx} className="feature-pill" title={val}>
                        {val.toFixed(2)}
                      </div>
                    ))}
                    <div className="feature-pill">...</div>
                  </div>
                  <p style={{marginTop: '1rem'}}><strong>Amount:</strong> ${transaction.amount.toFixed(2)}</p>
                </div>
              )}
            </>
          )}

          {scanType === 'upi' && (
            <>
              <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem'}}>
                Enter UPI transaction details manually or load a sample.
              </p>
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem'}}>
                <button className="btn btn-outline" onClick={() => loadSampleUpi('legitimate')} disabled={loading || scanning}>Load Safe UPI</button>
                <button className="btn btn-outline" onClick={() => loadSampleUpi('fraud')} disabled={loading || scanning}>Load Risky UPI</button>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <input 
                  type="number" 
                  placeholder="Amount (INR)" 
                  value={upiData.amount}
                  onChange={(e) => setUpiData({...upiData, amount: e.target.value})}
                  className="input-field"
                  style={{padding: '0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff'}}
                />
                <input 
                  type="text" 
                  placeholder="Sender UPI ID (e.g. sender@okicici)" 
                  value={upiData.sender}
                  onChange={(e) => setUpiData({...upiData, sender: e.target.value})}
                  className="input-field"
                  style={{padding: '0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff'}}
                />
                <input 
                  type="text" 
                  placeholder="Receiver UPI ID (e.g. unknown_spam@ybl)" 
                  value={upiData.receiver}
                  onChange={(e) => setUpiData({...upiData, receiver: e.target.value})}
                  className="input-field"
                  style={{padding: '0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff'}}
                />
              </div>
            </>
          )}

          {scanType === 'app' && (
            <>
              <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem'}}>
                Enter an App Package Name or Link to scan for malicious behavior before installing.
              </p>
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem'}}>
                <button className="btn btn-outline" onClick={() => loadSampleApp('legitimate')} disabled={loading || scanning}>Load Safe App</button>
                <button className="btn btn-outline" onClick={() => loadSampleApp('fraud')} disabled={loading || scanning}>Load Malicious App</button>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <input 
                  type="text" 
                  placeholder="App Name / Play Store URL / Package Name" 
                  value={appData.app_name}
                  onChange={(e) => setAppData({app_name: e.target.value})}
                  className="input-field"
                  style={{padding: '0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff'}}
                />
              </div>
            </>
          )}

        </div>

        {/* Right Column: Execution Engine */}
        <div className={`glass-card result-card ${result ? (result.prediction === 1 ? 'danger' : 'success') : ''}`}>
          <h2 style={{fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <ScanSearch size={20} /> Execution Engine
          </h2>
          
          <div style={{display: 'flex', justifyContent: 'center', margin: '2rem 0'}}>
            <button 
              className="btn" 
              style={{padding: '1rem 2rem', fontSize: '1.1rem', width: '100%', maxWidth: '300px'}}
              onClick={performScan} 
              disabled={scanning || (scanType === 'card' && !transaction) || (scanType === 'upi' && !upiData.amount) || (scanType === 'app' && !appData.app_name)}
            >
              {scanning ? 'Analyzing Parameters...' : `Run ${scanType === 'upi' ? 'UPI' : scanType === 'app' ? 'App' : 'Transaction'} Scan`}
            </button>
          </div>

          {result && (
            <div className="fade-in" style={{textAlign: 'center', marginTop: '2rem', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
              <div style={{fontSize: '3rem', fontWeight: 'bold', color: result.prediction === 1 ? 'var(--danger)' : 'var(--success)'}}>
                {(result.probability * 100).toFixed(1)}%
              </div>
              <p style={{color: 'var(--text-muted)'}}>Fraud Probability Score</p>
              
              <div className={`status-badge ${result.prediction === 1 ? 'danger' : 'success'}`}>
                {result.prediction === 1 ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
                {result.prediction === 1 ? 'HIGH RISK / MALICIOUS' : 'LOW RISK / SAFE'}
              </div>

              {result.risk_factors && (
                <div style={{marginTop: '2rem', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px'}}>
                  <h4 style={{marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)'}}>Explainable AI Context</h4>
                  <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem'}}>
                    {result.risk_factors.map((factor, i) => (
                      <li key={i} style={{marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <span style={{color: result.prediction === 1 ? 'var(--danger)' : 'var(--success)'}}>•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;
