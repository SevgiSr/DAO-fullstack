import * as fs from "fs";
import { network, ethers } from "hardhat";
import {
  proposalsFile,
  developmentChains,
  VOTING_PERIOD,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";

async function main() {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  // Get the last proposal for the network. You could also change it for your index
  const networkProposals = proposals[network.config.chainId!];
  const lastProposal = networkProposals[networkProposals.length - 1];
  // 0 = Against, 1 = For, 2 = Abstain for this example
  const voteWay = 1;
  const reason = "I lika do da cha cha";
  await vote(lastProposal.id, voteWay, reason);
}

// 0 = Against, 1 = For, 2 = Abstain for this example
export async function vote(
  proposalId: string,
  voteWay: number,
  reason: string
) {
  console.log("Voting...");
  const governor = await ethers.getContract("GovernorContract");
  const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason);
  const voteTxReceipt = await voteTx.wait(1);
  console.log(voteTxReceipt!.logs[0].args.reason);
  const proposalState = await governor.state(proposalId);
  console.log(`Current Proposal State: ${proposalState}`);
  // pass voting period on local blockchain
  // since you hold all the voting power, quorum is met
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
