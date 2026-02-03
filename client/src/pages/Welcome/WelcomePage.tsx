import { useNavigate } from '../OnboardingContext';
import './WelcomePage.css';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-icon">
          <svg width="120" height="120" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="90" fill="#e8ecef" />
            <path d="M60 120 L80 100 L100 110 L120 80 L140 100" stroke="#2c3e50" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <rect x="70" y="60" width="60" height="80" rx="8" stroke="#2c3e50" strokeWidth="6" fill="white"/>
            <line x1="80" y1="80" x2="120" y2="80" stroke="#27ae60" strokeWidth="4" strokeLinecap="round"/>
            <line x1="80" y1="95" x2="110" y2="95" stroke="#3498db" strokeWidth="4" strokeLinecap="round"/>
            <line x1="80" y1="110" x2="115" y2="110" stroke="#e74c3c" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>

        <h1>Welcome to the Personal Finance Dashboard</h1>
        <p className="welcome-description">
          Easily track your expenses, plan your budget, and achieve your financial goals.
        </p>

        <button className="btn-get-started" onClick={() => navigate('setup')}>
          Get Started
        </button>
      </div>
    </div>
  );
}
