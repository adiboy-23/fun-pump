import { useEffect, useState } from "react"
import { ethers } from "ethers"

function Trade({ toggleTrade, token, provider, factory }) {
  const [target, setTarget] = useState(0)
  const [limit, setLimit] = useState(0)
  const [cost, setCost] = useState(0)
  const [error, setError] = useState("")
  const [amount, setAmount] = useState("1")
  const [isLoading, setIsLoading] = useState(false)

  async function buyHandler(e) {
    e.preventDefault()
    try {
      setError("")
      setIsLoading(true)
      
      // Validate amount
      if (!amount || amount.trim() === "") {
        setError("Please enter an amount")
        return
      }

      // Validate if amount is a valid number
      if (isNaN(amount) || parseFloat(amount) <= 0) {
        setError("Please enter a valid positive number")
        return
      }

      const cost = await factory.getCost(token.sold)
      const totalCost = cost * BigInt(amount)

      const signer = await provider.getSigner()

      const transaction = await factory.connect(signer).buy(
        token.token,
        ethers.parseUnits(amount.toString(), 18),
        { value: totalCost }
      )
      await transaction.wait()

      toggleTrade()
    } catch (error) {
      console.error("Error buying tokens:", error)
      setError(error.message || "Error occurred while buying tokens")
    } finally {
      setIsLoading(false)
    }
  }

  async function getSaleDetails() {
    try {
      const target = await factory.TARGET()
      setTarget(target)

      const limit = await factory.TOKEN_LIMIT()
      setLimit(limit)

      const cost = await factory.getCost(token.sold)
      setCost(cost)
    } catch (error) {
      console.error("Error getting sale details:", error)
      setError(error.message || "Error occurred while getting sale details")
    }
  }

  useEffect(() => {
    getSaleDetails()
  }, [])

  const progress = (parseFloat(ethers.formatUnits(token.raised, 18)) / parseFloat(ethers.formatUnits(target, 18))) * 100

  return (
    <div className="trade-overlay">
      <div className="trade-modal">
        <button onClick={toggleTrade} className="close-button">×</button>
        
        <div className="trade-content">
          <div className="token-info">
            <div className="token-header">
              <h2>{token.name}</h2>
              <span className="creator">Created by {token.creator.slice(0, 6)}...{token.creator.slice(38, 42)}</span>
            </div>

            <div className="token-image">
              <img src={token.image} alt={token.name} width={256} height={256} />
            </div>

            <div className="token-stats">
              <div className="stat-item">
                <span className="stat-label">Market Cap</span>
                <span className="stat-value">{parseFloat(ethers.formatUnits(token.raised, 18)).toFixed(4)} GO</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Base Cost</span>
                <span className="stat-value">{parseFloat(ethers.formatUnits(cost, 18)).toFixed(4)} GO</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Progress</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <span className="progress-text">{progress.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {token.sold >= limit || token.raised >= target ? (
            <div className="target-reached">
              <span>🎉 Target Reached! 🎉</span>
            </div>
          ) : (
            <form onSubmit={buyHandler} className="buy-form">
              <div className="input-group">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1" 
                  max="10000" 
                  required 
                  step="1"
                />
                <span className="token-symbol">{token.name}</span>
              </div>
              <button 
                type="submit" 
                className={`buy-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : '[ Buy Tokens ]'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .trade-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .trade-modal {
          background: #1E1E1E;
          border-radius: 20px;
          width: 90%;
          max-width: 600px;
          position: relative;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease-out;
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #fff;
          font-size: 2rem;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .close-button:hover {
          opacity: 1;
        }

        .trade-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .token-info {
          text-align: center;
        }

        .token-header {
          margin-bottom: 1.5rem;
        }

        .token-header h2 {
          font-size: 2.5rem;
          margin: 0;
          background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .creator {
          color: #888;
          font-size: 0.9rem;
        }

        .token-image {
          margin: 1.5rem 0;
          position: relative;
          display: inline-block;
        }

        .token-image img {
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s;
        }

        .token-image:hover img {
          transform: scale(1.05);
        }

        .token-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-label {
          color: #888;
          font-size: 0.9rem;
        }

        .stat-value {
          font-size: 1.2rem;
          font-weight: bold;
          color: #4ECDC4;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          margin: 0.5rem 0;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4ECDC4, #FF6B6B);
          transition: width 0.3s ease-out;
        }

        .progress-text {
          font-size: 0.9rem;
          color: #888;
        }

        .error-message {
          background: rgba(255, 107, 107, 0.1);
          border-left: 4px solid #FF6B6B;
          padding: 1rem;
          border-radius: 4px;
          color: #FF6B6B;
          animation: shake 0.5s ease-in-out;
        }

        .buy-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-group input {
          width: 100%;
          padding: 1rem;
          padding-right: 80px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #fff;
          font-size: 1.1rem;
          transition: border-color 0.2s;
        }

        .input-group input:focus {
          outline: none;
          border-color: #4ECDC4;
        }

        .token-symbol {
          position: absolute;
          right: 1rem;
          color: #888;
        }

        .buy-button {
          background: linear-gradient(45deg, #4ECDC4, #2BAE9F);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
        }

        .buy-button:hover {
          transform: translateY(-2px);
        }

        .buy-button:active {
          transform: translateY(0);
        }

        .buy-button.loading {
          opacity: 0.7;
          cursor: wait;
        }

        .target-reached {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          padding: 1rem;
          border-radius: 12px;
          text-align: center;
          font-size: 1.2rem;
          font-weight: bold;
          animation: pulse 2s infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Trade;