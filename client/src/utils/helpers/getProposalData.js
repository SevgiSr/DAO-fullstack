import getContract from "./getContract";
import { ethers } from "ethers";
import getEventLogs from "./getEventLogs";

export async function getProposalData(proposalId) {
  try {
    const events = await getEventLogs();

    const proposalObj = events.find(
      (p) => p.proposalId === proposalId
    );

    console.log(proposalObj);

    // Retrieve the proposal details
    let { targets, values, calldatas, description } =
      proposalObj;

    targets = [...targets];
    values = [...values];
    calldatas = [...calldatas];
    console.log(targets, values, calldatas, description);

    const descriptionHash = ethers.keccak256(ethers.toUtf8Bytes(description));

    return {
      targets,
      values,
      calldatas,
      descriptionHash,
    };
  } catch (error) {
    console.log(error);
  }
}
