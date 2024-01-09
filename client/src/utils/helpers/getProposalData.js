import boxContract from "../contracts/Box.json";
import getContract from "./getContract";
import { ethers } from "ethers";

export async function getProposalData(proposalId) {
  try {
    const box = await getContract(boxContract);

    const proposalObj = JSON.parse(localStorage.getItem("11155111")).find(
      (p) => p.id === proposalId
    );

    // Retrieve the proposal details
    const proposalDetails = proposalObj.data;
    const { targets, values, functionToCall, args, description } =
      proposalDetails;

    const encodedFunctionCall = box.interface.encodeFunctionData(
      functionToCall,
      args
    );

    const calldatas = [encodedFunctionCall];

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
