import React, { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';

export default function ConnectWallet() {
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts.length > 0) {
                    accountChanged(accounts[0]);
                } else {
                    setErrorMessage('No accounts found');
                }
            } else {
                setErrorMessage('Kindly install MetaMask');
            }
        } catch (error) {
            setErrorMessage('Error connecting to wallet');
            console.error(error);
        }
    };

    const accountChanged = (accountName) => {
        setDefaultAddress(accountName);
    };

    return (
        <>
            <Button onClick={connectWallet}>Connect Wallet</Button>
            <h3>Address: {defaultAddress}</h3>
            {errorMessage && <p>{errorMessage}</p>}
        </>
    );
}
