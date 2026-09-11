import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  const fetchHoldings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/brokers/holdings');
      setHoldings(response.data.holdings || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch holdings. Connect your broker first!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setError('');
    try {
      // Trigger a sync by calling the backend test sync endpoint or trigger sync route
      await api.get('/api/test/sync-test'); // Wait, vite configured proxy matches /api directly
      await fetchHoldings();
    } catch (err) {
      setError(err.response?.data?.message || 'Sync failed.');
    } finally {
      setSyncing(false);
    }
  };

  // Calculate stats
  const totalValue = holdings.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.current_price)), 0);
  const totalInvestment = holdings.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.avg_price)), 0);
  const totalPnL = totalValue - totalInvestment;
  const pnlPercent = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--primary)' }}>Smart Portfolio</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Real-time consolidated asset insights</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/connect-broker')} className="btn btn-primary">
            Connect Broker
          </button>
          <button onClick={handleSync} disabled={syncing || loading} className="btn btn-secondary">
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
          <button onClick={logout} className="btn btn-secondary" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{ padding: '16px', background: 'var(--danger-glow)', border: '1px solid var(--danger)', borderRadius: '8px', color: 'var(--danger)', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card animate-fade-in">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Current Value</p>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
        </div>
        <div className="card animate-fade-in">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Total Investment</p>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>₹{totalInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
        </div>
        <div className="card animate-fade-in">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Total Returns (P&L)</p>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: totalPnL >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
            <span style={{ fontSize: '1rem', marginLeft: '8px', fontWeight: 500 }}>({pnlPercent.toFixed(2)}%)</span>
          </h2>
        </div>
      </div>

      {/* Table Section */}
      <div className="card animate-fade-in" style={{ padding: '0px', overflowX: 'auto' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Equity Holdings ({holdings.length})</h3>
        </div>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading holdings...
          </div>
        ) : holdings.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No holdings found. Connect a broker account to sync holdings.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Exchange</th>
                <th style={{ textAlign: 'right' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Avg Price</th>
                <th style={{ textAlign: 'right' }}>LTP</th>
                <th style={{ textAlign: 'right' }}>Current Value</th>
                <th style={{ textAlign: 'right' }}>P&L</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((item) => {
                const currentVal = parseFloat(item.quantity) * parseFloat(item.current_price);
                const investVal = parseFloat(item.quantity) * parseFloat(item.avg_price);
                const itemPnL = currentVal - investVal;
                const itemPnLPercent = investVal > 0 ? (itemPnL / investVal) * 100 : 0;
                
                return (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{item.symbol}</td>
                    <td><span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>{item.exchange}</span></td>
                    <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>₹{parseFloat(item.avg_price).toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>₹{parseFloat(item.current_price).toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 500 }}>₹{currentVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: itemPnL >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {itemPnL >= 0 ? '+' : ''}{itemPnL.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      <div style={{ fontSize: '0.75rem', fontWeight: 400 }}>({itemPnLPercent.toFixed(2)}%)</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
