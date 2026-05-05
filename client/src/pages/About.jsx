import React from 'react';
import { Shield, BrainCircuit, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="fade-in">
      <div style={{textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem'}}>
        <div style={{background: 'linear-gradient(to right, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', color: 'transparent', fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.5rem'}}>
          NeuroSentinel
        </div>
        <p style={{color: 'var(--text-muted)', fontSize: '1.2rem'}}>Enterprise-Grade Fraud Prevention Platform</p>
      </div>

      <div className="grid-3" style={{marginBottom: '3rem'}}>
        <div className="glass-card" style={{textAlign: 'center', padding: '2.5rem 2rem'}}>
          <Shield size={48} color="var(--danger)" style={{marginBottom: '1rem'}} />
          <h3 style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>Real-time Mitigation</h3>
          <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6}}>Intercepting fraudulent payloads within milliseconds before final bank settlement occurs.</p>
        </div>
        <div className="glass-card" style={{textAlign: 'center', padding: '2.5rem 2rem'}}>
          <BrainCircuit size={48} color="var(--primary)" style={{marginBottom: '1rem'}} />
          <h3 style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>Ensemble ML Engine</h3>
          <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6}}>Powered by massively parallel Random Forest logic trees perfectly optimized through Principal Component Analysis.</p>
        </div>
        <div className="glass-card" style={{textAlign: 'center', padding: '2.5rem 2rem'}}>
          <Zap size={48} color="var(--success)" style={{marginBottom: '1rem'}} />
          <h3 style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>Explainable AI</h3>
          <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6}}>Full cryptographic transparency into feature importance mapping and localized risk factor scoring models.</p>
        </div>
      </div>

      <div className="glass-card" style={{padding: '3rem'}}>
        <h2 style={{borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem'}}>Mission Statement</h2>
        <p style={{color: 'var(--text-muted)', lineHeight: 1.9, fontSize: '1.05rem'}}>
          Legacy rule-based fraud detection mechanisms are fundamentally ill-equipped to handle modern collective adversarial behavior. 
          NeuroSentinel replaces rigid, manual review queues with a stateless machine learning pipeline capable of unpacking deeply 
          obscured behavioral anomalies on the fly. By leveraging vast data streams and instantaneous analytical feedback loops, 
          our application secures enterprise financial infrastructures with complete contextual transparency and unyielding confidence.
        </p>
      </div>
    </div>
  );
};

export default About;
