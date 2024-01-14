import React, { useEffect, useState } from "react";
import { propose } from "../utils/helpers/propose";
import getContract from "../utils/helpers/getContract";
import boxContract from "../utils/contracts/Box.json";
import biggerBoxContract from "../utils/contracts/BiggerBox.json";
import { vote } from "../utils/helpers/vote.js";
import GovernorContract from "../utils/contracts/GovernorContract.json";
import { getProposalData } from "../utils/helpers/getProposalData.js";

export const ProposalContext = React.createContext();

export const ProposalProvider = ({ children }) => {
  const sendProposal = async (rawCalldatas, targets, desc) => {
    console.log("proposing");
    try {
      await propose(rawCalldatas, targets, desc);
      window.dispatchEvent(new CustomEvent("localStorageChange"));
      console.log("proposed!");
    } catch (error) {
      console.log(error);
    }
  };

  const voteProposal = async (proposalId, voteWay, reason) => {
    console.log("voting...");
    try {
      await vote(proposalId, voteWay, reason);
      console.log("voted!");
    } catch (error) {
      console.log(error);
    }
  };

  const getProposalState = async (proposalId) => {
    try {
      const governor = await getContract(GovernorContract);
      const state = await governor.state(proposalId);
      return state;
    } catch (error) {
      console.log(error);
    }
  };

  const queueProposal = async (proposalId) => {
    try {
      const governor = await getContract(GovernorContract);

      const { targets, values, calldatas, descriptionHash } =
        await getProposalData(proposalId);

      console.log("Queueing...");
      const queueTx = await governor.queue(
        targets,
        values,
        calldatas,
        descriptionHash
      );
      await queueTx.wait(1);
      console.log("Queued!");
    } catch (error) {
      console.log(error);
    }
  };

  const executeProposal = async (proposalId) => {
    try {
      const governor = await getContract(GovernorContract);
      const { targets, values, calldatas, descriptionHash } =
        await getProposalData(proposalId);

      console.log("Executing...");
      // this will fail on a testnet because you need to wait for the MIN_DELAY!
      const executeTx = await governor.execute(
        targets,
        values,
        calldatas,
        descriptionHash
      );
      await executeTx.wait(1);
      console.log("Executed!");
    } catch (error) {
      console.log(error);
    }
  };

  const readIntValue = async () => {
    try {
      // Assuming getContract function correctly initializes the contract
      const biggerBox = await getContract(biggerBoxContract);

      // Call the view function. No need for a provider or transaction here.
      const value = await biggerBox.retrieve_int();

      console.log(value);
      return Number(value);
    } catch (error) {
      console.error("Error retrieving value:", error);
    }
  };

  const readStrValue = async () => {
    try {
      // Assuming getContract function correctly initializes the contract
      const biggerBox = await getContract(biggerBoxContract);

      // Call the view function. No need for a provider or transaction here.
      const value = await biggerBox.retrieve_str();

      console.log(value);
      return value;
    } catch (error) {
      console.error("Error retrieving value:", error);
    }
  };

  return (
    <ProposalContext.Provider
      value={{
        sendProposal,
        voteProposal,
        readIntValue,
        readStrValue,
        getProposalState,
        queueProposal,
        executeProposal,
      }}
    >
      {children}
    </ProposalContext.Provider>
  );
};
