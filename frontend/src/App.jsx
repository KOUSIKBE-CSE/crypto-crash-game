import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Backend URL

function App() {
  const [username, setUsername] = useState('alice');
  const [wallet, setWallet] = useState({ BTC: null, ETH: null });
  const [prices, setPrices] = useState({ BTC: null, ETH: null });

  // ✅ Fetch wallet from backend on mount
  useEffect(() => {
    fetch(`/api/wallet/${username}`)
      .then(res => res.json())
      .then(data => {
        if (data.BTC && data.ETH) {
          setWallet({
            BTC: data.BTC.crypto,
            ETH: data.ETH.crypto,
          });
          setPrices({
            BTC: data.BTC.usd,
            ETH: data.ETH.usd,
          });
        }
      })
      .catch(err => {
        console.error('Failed to fetch wallet info 😞', err);
      });
  }, [username]);

  // ✅ Listen for gameStarted or gameEnded (price updates)
  useEffect(() => {
    socket.on('gameStarted', (data) => {
      if (data.prices) {
        const { BTC, ETH } = data.prices;
        setPrices({
          BTC: wallet.BTC ? +(wallet.BTC * BTC).toFixed(2) : null,
          ETH: wallet.ETH ? +(wallet.ETH * ETH).toFixed(2) : null
        });
      }
    });

    socket.on('gameEnded', (data) => {
      if (data.prices) {
        const { BTC, ETH } = data.prices;
        setPrices({
          BTC: wallet.BTC ? +(wallet.BTC * BTC).toFixed(2) : null,
          ETH: wallet.ETH ? +(wallet.ETH * ETH).toFixed(2) : null
        });
      }
    });

    return () => {
      socket.off('gameStarted');
      socket.off('gameEnded');
    };
  }, [wallet]);

  return (
    <div style={{ fontFamily: 'monospace', padding: '2rem' }}>
      <h2>🪙 Test Player Wallet</h2>
      <p>{username}</p>
      <p>
        💰 BTC: {wallet.BTC !== null ? `${wallet.BTC} (${prices.BTC ? `$${prices.BTC}` : '~$'})` : '(~$)'}
      </p>
      <p>
        💰 ETH: {wallet.ETH !== null ? `${wallet.ETH} (${prices.ETH ? `$${prices.ETH}` : '~$'})` : '(~$)'}
      </p>
    </div>
  );
}

export default App;
