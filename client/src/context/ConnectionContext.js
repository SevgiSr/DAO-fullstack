import React, { useEffect, useState } from "react";

export const ConnectionContext = React.createContext();

const { ethereum } = window;

export const ConnectionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);

  const checkIfWalletIsConnect = async () => {
    if (!ethereum) return alert("Please install MetaMask.");
    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    if (!ethereum) return alert("Please install MetaMask");
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      console.log("connected!");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /////////////BLOCK CONFIRMATION/////////////////////
  const listenForTransactionMine = (transactionResponse, provider) => {
    console.log(`Mining ${transactionResponse.hash}`);
    return new Promise((resolve, reject) => {
      try {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
          console.log(
            `Completed with ${transactionReceipt.confirmations} confirmations. `
          );
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        connectWallet,
        currentAccount,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
