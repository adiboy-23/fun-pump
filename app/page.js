"use client"

import { useEffect, useState } from "react"
import { ethers } from 'ethers'

// Components
import Header from "./components/Header"
import List from "./components/List"
import Token from "./components/Token"
import Trade from "./components/Trade"

// ABIs & Config
import Factory from "./abis/Factory.json"
import config from "./config.json"
import images from "./images.json"

export default function Home() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [factory, setFactory] = useState(null)
  const [fee, setFee] = useState(0)
  const [tokens, setTokens] = useState([])
  const [token, setToken] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showTrade, setShowTrade] = useState(false)
  const [networkError, setNetworkError] = useState(null)

  function toggleCreate() {
    showCreate ? setShowCreate(false) : setShowCreate(true)
  }

  function toggleTrade(token) {
    setToken(token)
    showTrade ? setShowTrade(false) : setShowTrade(true)
  }

  async function switchNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7A69' }], // 31337 in hex
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x7A69', // 31337 in hex
                chainName: 'Hardhat Local',
                nativeCurrency: {
                  name: 'GO',
                  symbol: 'GO',
                  decimals: 18
                },
                rpcUrls: ['http://127.0.0.1:8545']
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      }
      console.error('Error switching network:', error);
    }
  }

  async function loadBlockchainData() {
    try {
      setNetworkError(null)
      // Use MetaMask for our connection
      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)

      // Get the current network
      const network = await provider.getNetwork()
      console.log('Network:', network)
      console.log('Chain ID:', network.chainId)
      
      // Convert chainId to string since JSON keys are strings
      const chainIdStr = network.chainId.toString()
      if (!config[chainIdStr]) {
        const error = `Please connect to Hardhat Local Network (Chain ID: 31337). You are currently on network ${chainIdStr}.`
        setNetworkError(error)
        console.error(error)
        return
      }

      // Create reference to Factory contract
      const factory = new ethers.Contract(config[chainIdStr].factory.address, Factory, provider)
      setFactory(factory)

      // Fetch the fee
      const fee = await factory.fee()
      setFee(fee)

      // Prepare to fetch token details
      const totalTokens = await factory.totalTokens()
      const tokens = []

      // We'll get the first 6 tokens listed
      for (let i = 0; i < totalTokens; i++) {
        if (i == 6) {
          break
        }

        const tokenSale = await factory.getTokenSale(i)

        // We create our own object to store extra fields
        // like images
        const token = {
          token: tokenSale.token,
          name: tokenSale.name,
          creator: tokenSale.creator,
          sold: tokenSale.sold,
          raised: tokenSale.raised,
          isOpen: tokenSale.isOpen,
          image: images[i]
        }

        tokens.push(token)
      }

      // We reverse the array so we can get the most
      // recent token listed to display first
      setTokens(tokens.reverse())
    } catch (error) {
      console.error('Error in loadBlockchainData:', error)
      setNetworkError(error.message)
    }
  }

  useEffect(() => {
    loadBlockchainData()
  }, [showCreate, showTrade])

  return (
    <div className="page">
      <Header account={account} setAccount={setAccount} />

      <main>
        {networkError && (
          <div style={{ 
            padding: '1em', 
            margin: '1em', 
            backgroundColor: 'rgba(255, 0, 0, 0.1)', 
            border: '1px solid red',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '1em' }}>{networkError}</p>
            <button 
              onClick={switchNetwork}
              className="btn--fancy"
              style={{ cursor: 'pointer' }}
            >
              [ switch to hardhat network ]
            </button>
          </div>
        )}

        <div className="create">
          <button onClick={factory && account && toggleCreate} className="btn--fancy">
            {!factory ? (
              "[ contract not deployed ]"
            ) : !account ? (
              "[ please connect ]"
            ) : (
              "[ start a new token ]"
            )}
          </button>
        </div>

        <div className="listings">
          <h1>new listings</h1>

          <div className="tokens">
            {!account ? (
              <p>please connect wallet</p>
            ) : tokens.length === 0 ? (
              <p>No tokens listed</p>
            ) : (
              tokens.map((token, index) => (
                <Token
                  toggleTrade={toggleTrade}
                  token={token}
                  key={index}
                />
              ))
            )}
          </div>
        </div>

        {showCreate && (
          <List toggleCreate={toggleCreate} fee={fee} provider={provider} factory={factory} />
        )}

        {showTrade && (
          <Trade toggleTrade={toggleTrade} token={token} provider={provider} factory={factory} />
        )}
      </main>
    </div>
  );
}
