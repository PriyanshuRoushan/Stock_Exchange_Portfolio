import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConnectBroker() {
  const navigate = useNavigate();

  const handleConnectUpstox = () => {
    // Redirect directly to the backend's upstox connect URL
    window.location.href = '/api/brokers/upstox/connect';
  };

  const handleConnectZerodha = () => {
    window.location.href = '/api/brokers/zerodha/connect';
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>Connect Brokers</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Integrate your investment accounts to sync holdings</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Back to Dashboard
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Upstox Card */}
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '220px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>Upstox</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
              Connect your Upstox account to sync your long-term equities and F&O holdings securely.
            </p>
          </div>
          <button onClick={handleConnectUpstox} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            Connect Upstox
          </button>
        </div>

        {/* Zerodha Card */}
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '220px', opacity: 0.7 }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>Kite (Zerodha)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
              Link your Zerodha Kite account to aggregate your stock portfolio.
            </p>
          </div>
          <button onClick={handleConnectZerodha} className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
            Soon
          </button>
        </div>
      </div>
    </div>
  );
}
