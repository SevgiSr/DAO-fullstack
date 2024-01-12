import getContract from "./getContract";

// import boxContract from "../contracts/Box.json";
import biggerBoxContract from "../contracts/BiggerBox.json";
import GovernorContract from "../contracts/GovernorContract.json";
import { ethers } from "ethers";

export const proposals = {};
const { ethereum } = window;

export async function propose(rawCalldatas, proposalDescription) {
  const provider = new ethers.BrowserProvider(ethereum);

  const biggerBox = await getContract(biggerBoxContract);
  const governor = await getContract(GovernorContract);
  let encodedFunctionCalls = [];
  for (const [functionName, arg] of Object.entries(rawCalldatas)) {
    console.log(functionName, arg)
    const encodedFunctionCall = biggerBox.interface.encodeFunctionData(
      functionName,
      arg
    );
    encodedFunctionCalls.push(encodedFunctionCall);
  }

  console.log(
    `Proposing ${rawCalldatas} on ${await biggerBox.getAddress()}`
  );
  console.log(`Proposal Description:\n  ${proposalDescription}`);
  let targets = [await biggerBox.getAddress()];
  targets = Array(encodedFunctionCalls.length).fill(null).map(() => targets[0]);
  let values = [0];
  console.log(values);
  values = Array(encodedFunctionCalls.length).fill(null).map(() => values[0]);
  console.log(encodedFunctionCalls, targets, values);
  
  try {
    const proposeTx = await governor.propose(
      targets,
      values,
      encodedFunctionCalls,
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

  } catch (error) {
    console.error("Error submitting proposal:", error);
  }
}
