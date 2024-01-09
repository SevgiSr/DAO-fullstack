import React from "react";
import { propose } from "../utils/helpers/propose";
import getContract from "../utils/helpers/getContract";
import boxContract from "../utils/contracts/Box.json";
import { vote } from "../utils/helpers/vote.js";
import GovernorContract from "../utils/contracts/GovernorContract.json";
import { getProposalData } from "../utils/helpers/getProposalData.js";
export const ProposalContext = React.createContext();

export const ProposalProvider = ({ children }) => {
  const sendProposal = async () => {
    console.log("proposing");
    try {
      await propose([10], "store", "changes value to 77");
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
        getProposalData(proposalId);

      console.log("Queueing...");
      const queueTx = await governor.queue(
        targets,
        values,
        calldatas,
        descriptionHash
      );
      await queueTx.wait(1);
    } catch (error) {
      console.log(error);
    }
  };

  const executeProposal = async (proposalId) => {
    try {
      const governor = await getContract(GovernorContract);
      const { targets, values, calldatas, descriptionHash } =
        getProposalData(proposalId);

      console.log("Executing...");
      // this will fail on a testnet because you need to wait for the MIN_DELAY!
      const executeTx = await governor.execute(
        targets,
        values,
        calldatas,
        descriptionHash
      );
      await executeTx.wait(1);
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

  return (
    <ProposalContext.Provider
      value={{
        sendProposal,
        voteProposal,
        readValue,
        getProposalState,
        queueProposal,
        executeProposal,
      }}
    >
      {children}
    </ProposalContext.Provider>
  );
};
