import React, { useState, useRef, useEffect, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl } from '@solana/web3.js'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

require('@solana/wallet-adapter-react-ui/styles.css');

export function Phantom(props) {

    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);

    const wallets = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter({ network }),
    ];

    return(
        <div className="Phantom">
            <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <h4>Cookies Inc</h4>
                    <p>{props}</p>
                </WalletModalProvider>
            </WalletProvider>
            </ConnectionProvider>
        </div>
    )
}

export default Phantom;