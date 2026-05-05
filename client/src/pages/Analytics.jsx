import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Trash2 } from 'lucide-react';

const Analytics = () => {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    const loadScans = () => {
      try {
        const data = JSON.parse(localStorage.getItem('neuro_sentinel_scans') || '[]');
        setScans(data);
      } catch (e) {
        console.error("Local storage error", e);
      }
    };
    
    loadScans();
    window.addEventListener('scanAdded', loadScans);
    return () => window.removeEventListener('scanAdded', loadScans);
  }, []);

  const clearData = () => {
    localStorage.removeItem('neuro_sentinel_scans');
    setScans([]);
  };

  // 1. Top Level Metrics
  const totalScans = scans.length;
  const avgProbability = totalScans > 0 
    ? (scans.reduce((acc, curr) => acc + curr.probability, 0) / totalScans).toFixed(1) 
    : 0;
  
  const fraudCount = scans.filter(s => s.prediction === 1).length;
  const legitCount = totalScans - fraudCount;
  
  const detectionRate = totalScans > 0 
    ? ((fraudCount / totalScans) * 100).toFixed(1) 
    : 0;
    
  const avgSpeed = totalScans > 0
    ? Math.round(scans.reduce((acc, curr) => acc + (curr.speed || 0), 0) / totalScans)
    : 0;

  // 2. Cumulative Line Chart Data
  let cumLegit = 0;
  let cumFraud = 0;
  const cumulativeData = scans.map((s, idx) => {
    if (s.prediction === 1) cumFraud++;
    else cumLegit++;
    return {
      name: `#${idx + 1}`,
      Fraudulent: cumFraud,
      Legitimate: cumLegit
    };
  });

  // 3. Probability Distribution Data
  const probDist = { '0-10%': 0, '10-25%': 0, '25-50%': 0, '50-75%': 0, '75-100%': 0 };
  scans.forEach(s => {
    const p = s.probability;
    if (p <= 10) probDist['0-10%']++;
    else if (p <= 25) probDist['10-25%']++;
    else if (p <= 50) probDist['25-50%']++;
    else if (p <= 75) probDist['50-75%']++;
    else probDist['75-100%']++;
  });
  const barData = Object.keys(probDist).map(key => ({
    name: key,
    count: probDist[key]
  }));

  // 4. Pie Chart Data
  const pieData = [
    { name: 'Legitimate', value: legitCount, color: '#10b981' },
    { name: 'Fraudulent', value: fraudCount, color: '#ef4444' }
  ];

  // 5. Risk Levels
  const riskLevels = { low: 0, medium: 0, high: 0, critical: 0 };
  scans.forEach(s => {
    const p = s.probability;
    if (p < 25) riskLevels.low++;
    else if (p < 50) riskLevels.medium++;
    else if (p < 75) riskLevels.high++;
    else riskLevels.critical++;
  });

  const getRiskPercentage = (count) => {
    if (totalScans === 0) return 0;
    return Math.round((count / totalScans) * 100);
  };

  // 6. Radar Chart Data (Model Performance representation - Static for showcase)
  const radarData = [
    { subject: 'Accuracy', A: 96, fullMark: 100 },
    { subject: 'Precision', A: 91, fullMark: 100 },
    { subject: 'Recall', A: 89, fullMark: 100 },
    { subject: 'AUC-ROC', A: 98, fullMark: 100 },
    { subject: 'Specificity', A: 95, fullMark: 100 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--bg-card)', padding: '10px', border: '1px solid var(--border)', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: 0, color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1>Analytics</h1>
          <p className="subtitle" style={{marginBottom: 0}}>Fraud detection analytics & model performance</p>
        </div>
        <button className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={clearData}>
          <Trash2 size={16} /> Clear
        </button>
      </div>

      {/* Top Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', marginBottom: '0.5rem' }}>TOTAL SCANS</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa' }}>{totalScans}</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', marginBottom: '0.5rem' }}>AVG PROBABILITY</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38bdf8' }}>{avgProbability}%</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', marginBottom: '0.5rem' }}>DETECTION RATE</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' }}>{detectionRate}%</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', marginBottom: '0.5rem' }}>AVG SPEED</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ade80' }}>{avgSpeed}ms</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ height: '350px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{color: '#60a5fa'}}>📈</span> Cumulative Scan Results
          </h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={cumulativeData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
              <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}}/>
              <Line type="monotone" dataKey="Fraudulent" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Legitimate" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ height: '350px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{color: '#fbbf24'}}>📊</span> Probability Distribution
          </h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={barData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
              <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
              <Bar dataKey="count" fill="#fb923c" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{color: '#34d399'}}>⏱</span> Detection Breakdown
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ height: '300px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{color: '#ef4444'}}>📈</span> Risk Level Distribution
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <RiskBar label="Low" color="#10b981" count={riskLevels.low} percentage={getRiskPercentage(riskLevels.low)} />
            <RiskBar label="Medium" color="#3b82f6" count={riskLevels.medium} percentage={getRiskPercentage(riskLevels.medium)} />
            <RiskBar label="High" color="#fbbf24" count={riskLevels.high} percentage={getRiskPercentage(riskLevels.high)} />
            <RiskBar label="Critical" color="#ef4444" count={riskLevels.critical} percentage={getRiskPercentage(riskLevels.critical)} />
          </div>
        </div>

        <div className="glass-card" style={{ height: '300px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{color: '#8b5cf6'}}>🎯</span> Model Performance
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius={70} data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: '#94a3b8'}} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Performance" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

const RiskBar = ({ label, color, count, percentage }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
      <span style={{ color: 'var(--text-main)' }}>{label}</span>
      <span style={{ color: 'var(--text-muted)' }}>{count} ({percentage}%)</span>
    </div>
    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        left: 0, top: 0, height: '100%', 
        background: color, 
        width: `${percentage}%`,
        borderRadius: '3px',
        boxShadow: `0 0 10px ${color}88`
      }} />
      {/* Target indicator dot on the left */}
      <div style={{
          position: 'absolute',
          left: '-12px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: color
        }} />
    </div>
  </div>
);

export default Analytics;
