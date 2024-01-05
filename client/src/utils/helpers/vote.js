import getContract from "./getContract";
import GovernorContract from "../contracts/GovernorContract.json";

// 0 = Against, 1 = For, 2 = Abstain for this example
export async function vote(proposalId, voteWay, reason) {
  console.log("Voting...");
  const governor = await getContract(GovernorContract);
  const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason);
  const voteTxReceipt = await voteTx.wait(1);
  console.log(voteTxReceipt?.logs[0].args.reason);
  const proposalState = await governor.state(proposalId);
  console.log(`Current Proposal State: ${proposalState}`);
}
