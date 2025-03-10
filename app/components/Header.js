import { ethers } from "ethers"

function Header({ account, setAccount }) {
  async function connectHandler() {
    try {
      // This will open MetaMask and let the user select an account
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });
      
      // After permission is given, get the selected account
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts'
      });
      
      const account = ethers.getAddress(accounts[0])
      setAccount(account);
    } catch (error) {
      console.error('Error connecting account:', error);
    }
  }

  return (
    <header>
      <p className="brand">fun.pump</p>

      {account ? (
        <button onClick={connectHandler} className="btn--fancy">[ {account.slice(0, 6) + '...' + account.slice(38, 42)} ]</button>
      ) : (
        <button onClick={connectHandler} className="btn--fancy">[ connect ]</button>
      )}
    </header>
  );
}

export default Header;