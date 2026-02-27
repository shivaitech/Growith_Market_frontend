import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #070A29 0%, #0D0B22 100%)',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: 'linear-gradient(135deg, rgba(92, 39, 254, 0.15), rgba(157, 111, 255, 0.08))',
        border: '1.5px solid rgba(92, 39, 254, 0.3)',
        borderRadius: '24px',
        padding: '40px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 24px',
          background: 'linear-gradient(135deg, #6B35FF 0%, #9D6FFF 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#FFFFFF',
          margin: '0 0 12px 0',
        }}>
          Portfolio Dashboard
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.7)',
          margin: '0 0 32px 0',
          lineHeight: '1.6',
        }}>
          Welcome to your investor dashboard. This section is under development and will include your portfolio overview, investment history, and performance metrics.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <Link
            to="/nft"
            style={{
              display: 'block',
              padding: '16px 24px',
              background: 'linear-gradient(135deg, #6B35FF 0%, #9D6FFF 100%)',
              color: '#FFFFFF',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '15px',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 24px rgba(92, 39, 254, 0.4)',
            }}
          >
            Browse Marketplace
          </Link>
          
          <Link
            to="/"
            style={{
              display: 'block',
              padding: '16px 24px',
              background: 'rgba(92, 39, 254, 0.15)',
              color: '#DEC7FF',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '15px',
              border: '1.5px solid rgba(92, 39, 254, 0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            Return to Home
          </Link>
        </div>

        <p style={{
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.5)',
          margin: '24px 0 0 0',
        }}>
          🚧 Dashboard features coming soon
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
