export const developmentChains = ["hardhat", "localhost"];
export const proposalsFile = "proposals.json";

//args for timelock
export const MIN_DELAY = 3600; // 1 hour - minimum time delay (in seconds) that must pass after a proposal has been approved
//(or passed the voting process) before it can be executed

// args for governor contract
export const QUORUM_PERCENTAGE = 4; // Need 4% of voters to pass
// export const VOTING_PERIOD = 45818 // 1 week - how long the vote lasts. This is pretty long even for local tests
export const VOTING_PERIOD = 5; // blocks
export const VOTING_DELAY = 1; // 1 Block - How many blocks till voting period starts

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const NEW_STORE_VALUE = 77;
export const FUNC = "store";
export const PROPOSAL_DESCRIPTION = "Proposal #1 77 in the Box!";
