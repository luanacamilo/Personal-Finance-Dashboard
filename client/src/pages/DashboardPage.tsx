import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
        <button className="icon-button" title="Help">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        </button>
      </div>

      {/* Top Cards */}
      <div className="top-section">
        {/* Wallet */}
        <div className="card wallet-card">
          <div className="card-label">Wallet</div>
          <div className="wallet-amount">$ 4,523.98</div>
          <div className="wallet-details">
            <div className="detail-item">
              <span className="icon income">↗</span>
              <div>
                <div className="detail-label">Income</div>
                <div className="detail-value">$ 3,030.98</div>
              </div>
            </div>
            <div className="detail-item">
              <span className="icon expense">↘</span>
              <div>
                <div className="detail-label">Expenses</div>
                <div className="detail-value">$ 223.98</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payable Accounts */}
        <div className="card payable-card">
          <div className="card-label">Payable Accounts</div>
          <p className="card-description">Keep your accounts up to date to avoid issues.</p>
          <div className="progress-info">
            <span className="progress-text">14 OUT OF 16</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '87.5%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Transactions List */}
        <div className="card transactions-card">
          <h3>Transactions</h3>
          <div className="transaction-list">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="transaction-item">
                <span className="transaction-icon">↓</span>
                <div className="transaction-info">
                  <span className="transaction-name">Shopping</span>
                  <span className="transaction-date">Nov 25</span>
                </div>
                <span className="transaction-amount">R$ 300</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Earnings Chart */}
        <div className="card earnings-card">
          <div className="card-header-inline">
            <h3>Monthly earnings</h3>
            <span className="earnings-amount">$ 3,030.98</span>
          </div>
          <div className="chart-placeholder">
            <svg viewBox="0 0 300 150" className="earnings-chart">
              <polyline
                points="0,120 30,100 60,110 90,80 120,90 150,70 180,60 210,80 240,50 270,65 300,40"
                fill="none"
                stroke="#2c3e50"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="months-labels">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
          </div>
        </div>

        {/* Earnings Donut */}
        <div className="card earnings-donut-card">
          <h3>Earnings</h3>
          <div className="donut-chart">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#e8ecef" strokeWidth="25" />
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke="#2c3e50" 
                strokeWidth="25"
                strokeDasharray="377 125"
                strokeDashoffset="0"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className="donut-center">
              <div className="donut-amount">$ 4,523.98</div>
            </div>
          </div>
          <div className="donut-legend">
            <div className="legend-item">
              <span className="legend-dot earnings"></span>
              <span>Earnings</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot goals"></span>
              <span>Goals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panels */}
      <div className="side-panels">
        {/* Receipts */}
        <div className="card receipts-card">
          <h3>Receipts</h3>
          <div className="receipt-list">
            <div className="receipt-item">
              <span className="receipt-icon">↗</span>
              <div>
                <div className="receipt-name">Salary</div>
                <div className="receipt-amount">$ 5,000.00</div>
              </div>
            </div>
            <div className="receipt-item">
              <span className="receipt-icon">↗</span>
              <div>
                <div className="receipt-name">Services</div>
                <div className="receipt-amount">$ 593.00</div>
              </div>
            </div>
            <div className="receipt-item">
              <span className="receipt-icon">↗</span>
              <div>
                <div className="receipt-name">Rent or Mortgage</div>
                <div className="receipt-amount">$ 3,030.98</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payables */}
        <div className="card payables-card">
          <h3>Payables</h3>
          <div className="payable-list">
            <div className="payable-item">
              <span className="payable-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </span>
              <div>
                <div className="payable-name">Electricity Bill</div>
                <div className="payable-amount">$ 202.98</div>
              </div>
            </div>
            <div className="payable-item">
              <span className="payable-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </span>
              <div>
                <div className="payable-name">Rent or Mortgage</div>
                <div className="payable-amount">$ 3,030.98</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
