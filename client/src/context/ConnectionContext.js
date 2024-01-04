import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { propose } from "../utils/helpers/propose";
import getContract from "../utils/helpers/getContract";
import boxContract from "../utils/contracts/Box.json";

export const ConnectionContext = React.createContext();

const { ethereum } = window;

export const ConnectionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");

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

  const sendProposal = async () => {
    console.log("proposing");
    try {
      await propose([1], "store", "changes value to 77");
      console.log("proposed!");
    } catch (error) {
      console.log(error);
    }
  };

  const readValue = async () => {
    try {
      // Assuming getContract function correctly initializes the contract
      const box = await getContract(boxContract);

      // Call the view function. No need for a provider or transaction here.
      const value = await box.retrieve();

      console.log("Retrieved value:", value);
    } catch (error) {
      console.error("Error retrieving value:", error);
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
      value={{ connectWallet, currentAccount, sendProposal, readValue }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
