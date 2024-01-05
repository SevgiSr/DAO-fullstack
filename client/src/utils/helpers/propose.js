import getContract from "./getContract";

import boxContract from "../contracts/Box.json";
import GovernorContract from "../contracts/GovernorContract.json";
import { ethers } from "ethers";

export const proposals = {};
const { ethereum } = window;

export async function propose(args, functionToCall, proposalDescription) {
  const provider = new ethers.BrowserProvider(ethereum);

  const box = await getContract(boxContract);
  const governor = await getContract(GovernorContract);
  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  console.log(
    `Proposing ${functionToCall} on ${await box.getAddress()} with ${args}`
  );
  console.log(`Proposal Description:\n  ${proposalDescription}`);

  try {
    const proposeTx = await governor.propose(
      [await box.getAddress()],
      [0],
      [encodedFunctionCall],
      proposalDescription
    );
    const proposalReceipt = await proposeTx.wait();

    //////// AFTER PROPOSING SAVE PROPOSAL ID /////////
    const proposalId = await proposalReceipt?.logs[0].args.proposalId; //just changed that to await aand it worked

    console.log(`Proposed with proposal ID:\n  ${proposalId}`);

    /*     const proposalState = await governor.state(proposalId);
    const proposalSnapShot = await governor.proposalSnapshot(proposalId);
    const proposalDeadline = await governor.proposalDeadline(proposalId);
; */

    const network = await provider.getNetwork();
    console.log(network);

    const chainId = network.chainId?.toString();

    const proposalObj = {
      id: proposalId.toString(),
      data: {
        targets: [await box.getAddress()],
        values: [0],
        functionToCall,
        args,
        description: proposalDescription,
      },
    };

    await storeProposal(chainId, proposalObj);
  } catch (error) {
    console.error("Error submitting proposal:", error);
  }
}

async function storeProposal(chainId, proposalObj) {
  let proposalArray = localStorage.getItem(chainId);

  if (!proposalArray) {
    // If there is no existing array, initialize an empty array and save it
    proposalArray = [];
  } else {
    // If there is an existing array, parse it from the stored string
    proposalArray = JSON.parse(proposalArray);
  }

  proposalArray.push(proposalObj);
  localStorage.setItem(chainId, JSON.stringify(proposalArray));
}
