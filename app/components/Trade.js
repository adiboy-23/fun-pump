import { useEffect, useState } from "react"
import { ethers } from "ethers"

function Trade({ toggleTrade, token, provider, factory }) {
  const [target, setTarget] = useState(0)
  const [limit, setLimit] = useState(0)
  const [cost, setCost] = useState(0)
  const [error, setError] = useState("")

  async function buyHandler(form) {
    try {
      setError("")
      const amount = form.get("amount")
      
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

  return (
    <div className="trade">
      <h2>trade</h2>

      <div className="token__details">
        <p className="name">{token.name}</p>
        <p>creator: {token.creator.slice(0, 6) + '...' + token.creator.slice(38, 42)}</p>
        <img src={token.image} alt="Pepe" width={256} height={256} />
        <p>marketcap: {ethers.formatUnits(token.raised, 18)} ETH</p>
        <p>base cost: {ethers.formatUnits(cost, 18)} ETH</p>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          margin: '1em 0', 
          padding: '0.5em', 
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      {token.sold >= limit || token.raised >= target ? (
        <p className="disclaimer">target reached!</p>
      ) : (
        <form action={buyHandler}>
          <input 
            type="number" 
            name="amount" 
            min="1" 
            max="10000" 
            placeholder="1" 
            required 
            step="1"
          />
          <input type="submit" value="[ buy ]" />
        </form>
      )}

      <button onClick={toggleTrade} className="btn--fancy">[ cancel ]</button>
    </div>
  );
}

export default Trade;