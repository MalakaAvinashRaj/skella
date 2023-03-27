import React, { useState } from "react";
import { Connection, Transaction, SystemProgram, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import './phantom.css';
import * as buffer from "buffer";

export function Phantom() {

  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState(null);
  const [connected, setConnected] = useState(false);
  const [key, setKey] = useState(null);

  const network = clusterApiUrl('devnet');
  const connection = new Connection(network, 'confirmed');

  window.Buffer = buffer.Buffer;
  const destPubkeyStr = 'B1MEySUG5zs3zMC5BEfi8w5p7r6tVDgc93xQynkTw2z3'

  //-------------------------- Connect & Disconnect -----------------------------//

  const connectWallet = async () => {
    try {
      if (window.phantom?.solana.isPhantom) {
        const resp = await window.solana.connect();
        setConnected(!connected);
        setWallet(resp.publicKey.toString());
        setKey(resp)
      }
    }
    catch (err) {
      console.log(err);
      console.log('error at connect wallet');
    }
  };

  const disconectWallet = async () => {
    try {
      await window.solana.disconnect();
      setConnected(!connected);
    }
    catch (err) {
      console.error(err);
      console.log('Error at wallet disconnect');
    }
    console.log(connected);
  }

  //-------------------------- Transaction -----------------------------//

  async function signInTransactionAndSendMoney() {

    const lamports = amount * LAMPORTS_PER_SOL;

    try {

      setStatus("started");
      const destPubkey = new PublicKey(destPubkeyStr);

      const walletAccountInfo = await connection.getAccountInfo(key.publicKey);
      console.log("wallet data size", walletAccountInfo?.data.length);

      const receiverAccountInfo = await connection.getAccountInfo(destPubkey);
      console.log("receiver data size", receiverAccountInfo?.data.length);

      const instruction = SystemProgram.transfer({
        fromPubkey: key.publicKey,
        toPubkey: destPubkey,
        lamports,
      });

      let trans = await setWalletTransaction(instruction, connection);
      let signature = await signAndSendTransaction(key, trans, connection);

      setStatus("waiting");

      let result = await connection.confirmTransaction(signature, "singleGossip");
      setStatus("success");
      console.log("money sent", result);

    }
    catch (e) {
      setStatus("failed");
      console.error("Transaction Failed", e);
    }

  }


  async function setWalletTransaction(instruction, connection) {

    const transaction = new Transaction();

    transaction.add(instruction);
    transaction.feePayer = key.publicKey;

    let hash = await connection.getRecentBlockhash();
    console.log("blockhash", hash);

    transaction.recentBlockhash = hash.blockhash;
    return transaction;

  }

  async function signAndSendTransaction(key, transaction, connection) {

    const { signature } = await window.solana.signAndSendTransaction(transaction);
    await connection.confirmTransaction(signature);

    console.log("sign transaction");
    console.log("send raw transaction");
    return signature;

  }

  //------------------------- Connect Button ------------------------------//


  const handleConnectButton = async () => {
    if (connected) {
      try {
        console.log(`handle Disconnect`);
        disconectWallet();
        setWallet(null);
      }
      catch (e) {
        console.log(e);
        console.log(`error at handle Disonnect`);
      }
      console.log(connected);
    }
    else {
      try {
        console.log(`handle Connect`);
        await connectWallet()
      }
      catch (e) {
        console.log(e);
        console.log(`error at handle Connect`);
      }
      console.log(`Connected with Public Key: ${wallet}`)
      console.log(wallet);
    }
  }

  //-------------------------- Wallet Button -----------------------------//

  const returnWallet = async () => {
    console.log(`wallet: ${wallet}`);
    console.log(`key: ${key}`);
  }

  //-------------------------- HTML -----------------------------//


  return (
    <div className="phantom">

      <h3>Phantom wallet</h3>

      <div>
        <button className="buttons" onClick={handleConnectButton}>{connected ? "Disconnect" : "Connect"}</button>
        <input className="buttons" onChange={(event) => setAmount(event.target.value)} type="text" value={amount} />
        <button className="buttons" onClick={signInTransactionAndSendMoney} disabled={!connected || amount === 0} >Send</button>
        <button className="buttons" onClick={returnWallet} disabled={!connected} >Wallet</button>
      </div>

      {wallet === null ? <p>Wallet not connected</p> : <p>connected to {wallet.substring(0, 4) + "...." + wallet.substr(wallet.length - 4, wallet.length)}</p>}
      {(status === "started" ? <p>Transaction Started</p> : null) || (status === "success" ? <p>Transaction Successfull</p> : null) || (status === "waiting" ? <p>Waiting for conformation...</p> : null) || (status === "failed" ? <p>Transaction Failed</p> : null)
      }
      {/* {status === "started" ? <p>Transaction Started</p> : null}
      {status === "success" ? <p>Transaction Successfull</p> : null}
      {status === "waiting" ? <p>Waiting for conformation...</p> : null}
      {status === "failed" ? <p>Transaction Failed</p> : null} */}

    </div>
  );
}

export default Phantom;
