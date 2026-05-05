import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Database, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const [health, setHealth] = useState({ status: 'checking', model_loaded: false });

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await axios.get('http://localhost:5000/');
        setHealth({
          status: res.data.status,
          model_loaded: res.data.model_loaded
        });
      } catch (err) {
        setHealth({ status: 'offline', model_loaded: false });
      }
    };
    checkServer();
  }, []);

  return (
    <div className="fade-in">
      <h1>System Overview</h1>
      <p className="subtitle">Real-time status of the NeuroSentinel infrastructure.</p>
      
      <div className="grid-3">
        <div className="glass-card stat-card">
          <Activity size={32} color={health.status === 'online' ? '#10b981' : '#ef4444'} />
          <div className="value">
            {health.status === 'checking' ? '...' : (health.status === 'online' ? 'Online' : 'Offline')}
          </div>
          <div className="label">API Server Status</div>
        </div>
        
        <div className="glass-card stat-card">
          <Database size={32} color={health.model_loaded ? '#3b82f6' : '#ef4444'} />
          <div className="value">
            {health.model_loaded ? 'Active' : 'Missing'}
          </div>
          <div className="label">Model Connectivity</div>
        </div>
        
        <div className="glass-card stat-card">
          <ShieldCheck size={32} color="#8b5cf6" />
          <div className="value">~15ms</div>
          <div className="label">Avg Prediction Latency</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
