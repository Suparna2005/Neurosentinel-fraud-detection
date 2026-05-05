import React from 'react';
import { TrendingUp, Globe, ShoppingCart, CreditCard } from 'lucide-react';

const Trending = () => {
  return (
    <div className="fade-in">
      <h1>Trending Analysis</h1>
      <p className="subtitle">Macro-level global fraud vector spotting and geographical heat.</p>

      <div className="grid-2" style={{marginBottom: '2rem'}}>
        <div className="glass-card">
          <h2 style={{fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <TrendingUp size={20} color="var(--danger)" /> Sector Vectors (7D)
          </h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <TrendItem icon={<ShoppingCart />} name="E-Commerce Payment APIs" change="+14.2%" risk="critical" />
            <TrendItem icon={<Globe />} name="Cross-Border Wire Transfers" change="+8.7%" risk="high" />
            <TrendItem icon={<CreditCard />} name="Retail POS Terminals" change="-2.1%" risk="low" />
          </div>
        </div>
        
        <div className="glass-card" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
           <Globe size={64} color="var(--primary)" style={{opacity: 0.5, marginBottom: '1rem'}} />
           <h2 style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>Global Heatmap Active</h2>
           <p style={{color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem'}}>Cross-referencing network anomalies across 140 geographical regions to intercept decentralized fraud clusters.</p>
        </div>
      </div>
    </div>
  );
};

const TrendItem = ({ icon, name, change, risk }) => {
  const isUp = change.includes('+');
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
        <div style={{padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--text-muted)'}}>
          {icon}
        </div>
        <span style={{fontWeight: 500}}>{name}</span>
      </div>
      <div style={{textAlign: 'right'}}>
        <div style={{color: isUp ? 'var(--danger)' : 'var(--success)', fontWeight: 'bold'}}>{change}</div>
        <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize'}}>{risk} Risk</div>
      </div>
    </div>
  );
};

export default Trending;
