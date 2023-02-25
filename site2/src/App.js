import './App.css';
import React, { useState } from 'react';
import Phantom from './components/phantom';
import QrCode from './components/qrCode';


export function App() {

  const [qrCode, setQrCode] = useState(false)

  return (
    <div className="App">
      <h4>Please make payment</h4>
      <p>Select mode of payment</p>
      <button onClick={() => setQrCode(!qrCode)}>{qrCode ? "Phantom" : "QR code"}</button>
      {qrCode ? <QrCode /> : <Phantom />}
    </div>
  )
}

export default App;
