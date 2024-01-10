const { ethers, JsonRpcProvider, id } = require('ethers');

// Connect to the Ethereum node
const provider = new JsonRpcProvider('https://ethereum-sepolia.publicnode.com');

// Contract address and ABI
const govAddress = '0x61e9cdB27B43B01528F916f03298956Bb1F7BD1F';
const govAbi = require('./gov_abi.json'); // Assuming gov_abi.json is in the same directory

// Create a contract object
const contract = new ethers.Contract(govAddress, govAbi, provider);

// Event signature
const event = 'ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)';

// Define the event signature and filter parameters
const eventSignatureHash = id(event);
const fromBlock = 5005781; // Starting block


async function getEventLogs() {
    let eventList = [];
    const maxBlockRange = 50000;
    let currentBlock = fromBlock;

    // Fetch the current latest block number
    const latestBlock = await provider.getBlockNumber();
    console.log("Latest block:", latestBlock);

    while (currentBlock <= latestBlock) {
        let endBlock = currentBlock + maxBlockRange - 1; // Adjust for inclusivity
        if (endBlock > latestBlock) {
            endBlock = latestBlock;
        }

        try {
            const logs = await provider.getLogs({
                fromBlock: currentBlock,
                toBlock: endBlock,
                address: govAddress,
                topics: [eventSignatureHash]
            });

            const eventFragment = contract.interface.getEvent('ProposalCreated');

            // Decode and process logs
            for (let log of logs) {
                const event = contract.interface.parseLog(log);
                const namedArgs = {};
                eventFragment.inputs.forEach((input, index) => {
                    if (input.name === 'proposalId') {
                        // Convert proposalId to hex string
                        namedArgs[input.name] = '0x'+event.args[index].toString(16);

                    } else {
                        namedArgs[input.name] = event.args[index];
                    }
                });
                eventList.push({...event, args: namedArgs}['args']);
                // console.log(eventList[eventList.length - 1])
            }
        } catch (error) {
            console.error(error);
        }

        currentBlock = endBlock + 1;
    }

    return eventList;
}

export default getEventLogs;