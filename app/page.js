"use client";

import { useState } from "react";

// Components
import Header from "./components/Header"
import List from "./components/List"


export default function Home() {
  const [showCreate, setShowCreate] = useState(false)

  const toggleCreate = () => {
    showCreate ? setShowCreate(false) : setShowCreate(true)
  }

  return (
    <div className="page">
      <Header /><main>
        <div className="create">
          <button onClick={toggleCreate}>[ Start a new Token ]</button>
        </div>

        <div className="listings">
          <h1>New listings</h1>

          <div className="tokens">
            <div className="token">
              <img src="" alt="temp" />

              <div className="token__details">
                <p>Created by 0x0...000</p>
                <p>Market Cap: 0.50 ETH</p>
                <p>My Favorite Token</p>
              </div>
            </div>
            <div className="token">
              <img src="" alt="temp" />

              <div className="token__details">
                <p>Created by 0x0...000</p>
                <p>Market Cap: 0.50 ETH</p>
                <p>My Favorite Token</p>
              </div>
            </div>
            <div className="token">
              <img src="" alt="temp" />

              <div className="token__details">
                <p>Created by 0x0...000</p>
                <p>Market Cap: 0.50 ETH</p>
                <p>My Favorite Token</p>
              </div>
            </div>
          </div>
        </div>

        {showCreate && (
          <List toggleCreate={toggleCreate} />
        )}
      </main>
      </div>
  );
}