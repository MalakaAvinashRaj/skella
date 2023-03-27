import React, { useState, useRef, useEffect, useMemo } from "react";
import {
    createQR,
    encodeURL,
    findReference,
    validateTransfer,
    FindReferenceError,
    ValidateTransferError,
} from "@solana/pay";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";

export function QrCode() {

    const [inputAmount, setInputAmount] = useState(0);
    const [payments, setPayments] = useState(false)

    const qrRef = useRef(null);
    const shopAddress = new PublicKey("3iZKfdQUfvMpGWot6dUg3iytGLhsh2Jd7tThqDKLKEB2");

    const reference = useMemo(() => Keypair.generate().publicKey, []);
    const amount = BigNumber(inputAmount);

    
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);
    const connection = new Connection(endpoint);

    const url = encodeURL({
        recipient: shopAddress,
        amount,
        reference,
        label: "Cookies Inc",
        message: "Thanks for your order! 🍪",
    });


    // Show the QR code
    useEffect(() => {
        const qr = createQR(url, 512, "transparent");

        if (qrRef.current && amount.isGreaterThan(0)) {
            qrRef.current.innerHTML = "";
            qr.append(qrRef.current);
        }
    });

    useEffect(() => {

        const interval = setInterval(async () => {

            try {
                const signatureInfo = await findReference(connection, reference, {
                    finality: "confirmed",
                });

                const result = await connection.confirmTransaction({
                    signature: signatureInfo.signature,
                },
                'finalized');
                
                setPayments(true);
                
                // router.push("/shop/confirmed");

            } catch (e) {

                if (e instanceof FindReferenceError) {
                    return;
                }

                if (e instanceof ValidateTransferError) {
                    console.error("Transaction is invalid", e);
                    return;
                }

                console.error("Unknown error", e);
            }

        }, 500);

        return () => {
            clearInterval(interval);
        };

    }, [amount]);


    return (
        
        <div className="flex flex-col items-center gap-8">
            <input
                type="text"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
            />
            <p>Checkout: {inputAmount}Sol</p>
            {payments ? <h1>Payment successful</h1> : <div ref={qrRef} />}
        </div>
    );
}

export default QrCode;
