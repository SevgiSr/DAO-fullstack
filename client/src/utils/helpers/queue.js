import GovernorContract from "../contracts/GovernorContract.json";
import boxContract from "../contracts/Box.json";
import getContract from "./getContract";
import { ethers } from "ethers";

export async function queue(proposalId) {
  const governor = await getContract(GovernorContract);
  const box = await getContract(boxContract);

  const proposalObj = JSON.parse(localStorage.getItem("11155111")).find(
    (p) => p.id === proposalId
  );

  // Retrieve the proposal details
  const proposalDetails = proposalObj.data;
  const { targets, values, functionToCall, args, description } =
    proposalDetails;

  console.log(targets, values, functionToCall, args, description);

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  const descriptionHash = ethers.keccak256(ethers.toUtf8Bytes(description));

  try {
    console.log("Queueing...");
    const queueTx = await governor.queue(
      targets,
      values,
      [encodedFunctionCall],
      descriptionHash
    );
    await queueTx.wait(1);
  } catch (error) {
    console.log(error);
  }
}
