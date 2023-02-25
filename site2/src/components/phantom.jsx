import React, { useState } from 'react';


export function Phantom() {

    const [connected, setConnected] = useState(false);


  return (
    <div className="phantom">
      <p>Phantom wallet</p>
      <button onClick={() => setConnected(!connected)}>{connected ? "Connect" : "Disconnect"}</button>
    </div>
  )
}

export default Phantom;
