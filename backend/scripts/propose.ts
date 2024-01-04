import {
  NEW_STORE_VALUE,
  FUNC,
  PROPOSAL_DESCRIPTION,
  developmentChains,
  VOTING_DELAY,
  proposalsFile,
} from "../helper-hardhat-config";
import { ethers, network } from "hardhat";
import { moveBlocks } from "../utils/move-blocks";
import * as fs from "fs";

export async function propose(
  args: any[],
  functionToCall: string,
  proposalDescription: string
) {
  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");
  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  console.log(
    `Proposing ${functionToCall} on ${await box.getAddress()} with ${args}`
  );
  console.log(`Proposal Description:\n  ${proposalDescription}`);

  const proposeTx = await governor.getFunction("propose")(
    [await box.getAddress()] /* TARGET: Our only target is box contract */,
    [0] /* VALUES: We have no eth to send */,
    [encodedFunctionCall] /* CALLDATA: List of encoded function calls */,
    proposalDescription
  );

  // Becase of voting delay, we have to wait before voting
  // But since we're on a lcoal blockchain, we want to speed that up

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  // save proposal id so that next scripts can find and vote
  const proposeReceipt = await proposeTx.wait(1);
  const proposalId = await proposeReceipt!.logs[0].args.proposalId;
  console.log(`Proposed with proposal ID:\n  ${proposalId}`);

  const proposalState = await governor.getFunction("state")(proposalId);
  const proposalSnapShot = await governor.getFunction("proposalSnapshot")(
    proposalId
  );
  const proposalDeadline = await governor.getFunction("proposalDeadline")(
    proposalId
  );

  const proposalObj = {
    targets: [await box.getAddress()],
    values: [0],
    calldatas: [encodedFunctionCall],
    descriptionHash: ethers.keccak256(ethers.toUtf8Bytes(proposalDescription)),
  };
  // save the proposalId
  storeProposalId(proposalId, proposalObj);

  // the Proposal State is an enum data type, defined in the IGovernor contract.
  // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
  console.log(`Current Proposal State: ${proposalState}`);
  // What block # the proposal was snapshot
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`);
  // The block number the proposal voting expires
  console.log(`Current Proposal Deadline: ${proposalDeadline}`);
}

function storeProposalId(proposalId: any, proposalObj: any) {
  const chainId = network.config.chainId!.toString();
  let proposals: any;

  if (fs.existsSync(proposalsFile)) {
    proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  } else {
    proposals = {};
  }
  if (!proposals[chainId]) proposals[chainId] = [];
  // map proposal id's to proposal data in chainId
  proposals[chainId].push({
    id: proposalId.toString(),
    data: proposalObj,
  });
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals), "utf8");
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
