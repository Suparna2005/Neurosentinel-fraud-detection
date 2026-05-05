import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Analytics from './pages/Analytics';
import Trending from './pages/Trending';
import About from './pages/About';

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', marginRight: '2rem'}}>
      <span style={{color: '#60a5fa'}}>⏱</span>
      {time.toLocaleDateString()} {time.toLocaleTimeString()}
    </div>
  );
};

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="brand">NeuroSentinel</div>
        <LiveClock />
        <div className="nav-links">
          <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Dashboard</NavLink>
          <NavLink to="/scanner" className={({isActive}) => isActive ? "active" : ""}>Scanner</NavLink>
          <NavLink to="/analytics" className={({isActive}) => isActive ? "active" : ""}>Analytics</NavLink>
          <NavLink to="/trending" className={({isActive}) => isActive ? "active" : ""}>Trending</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? "active" : ""}>About</NavLink>
        </div>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
