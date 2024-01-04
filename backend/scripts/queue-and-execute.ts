import { ethers, network } from "hardhat";
import {
  proposalsFile,
  MIN_DELAY,
  developmentChains,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";
import { moveTime } from "../utils/move-time";
import * as fs from "fs";

async function main() {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  // Get the last proposal for the network. You could also change it for your index
  const proposalObj = proposals[network.config.chainId!].at(-1);

  console.log(proposalObj);

  await queueAndExecute(proposalObj);

  const box = await ethers.getContract("Box");
  console.log(`Box value: ${await box.retrieve()}`);
}

async function queueAndExecute(proposalObj: any) {
  const governor = await ethers.getContract("GovernorContract");

  // Retrieve the proposal details
  const proposalDetails = proposalObj.data;

  // we don't even need to get box contract because it's stored in targets
  // functions to call and arguments is stored in calldatas
  const targets = proposalDetails.targets; //[await box.getAddress()]
  const values = proposalDetails.values; //[0]
  const calldatas = proposalDetails.calldatas; //[encodedFunctionCall] - FUNC and NEW_STORE_VALUE was already encoded while creating proposal, why encode it again?
  const descriptionHash = proposalDetails.descriptionHash; //descriptionHash

  console.log(targets);

  // could also use ethers.utils.id(PROPOSAL_DESCRIPTION)

  console.log("Queueing...");
  const queueTx = await governor.queue(
    targets,
    values,
    calldatas,
    descriptionHash
  );
  await queueTx.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  console.log("Executing...");
  // this will fail on a testnet because you need to wait for the MIN_DELAY!
  const executeTx = await governor.execute(
    targets,
    values,
    calldatas,
    descriptionHash
  );
  await executeTx.wait(1);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
