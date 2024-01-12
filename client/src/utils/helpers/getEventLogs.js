const { ethers, JsonRpcProvider, id } = require('ethers');

// Connect to the Ethereum node
const provider = new JsonRpcProvider('https://ethereum-sepolia.publicnode.com');

// Contract address and ABI
const govAddress = '0x61e9cdB27B43B01528F916f03298956Bb1F7BD1F';
const biggerBoxAddress = '0xa73AD35f210D1F97b9691E6163De4986bf902A8b';
const boxAddress = '0xa35503e5f050F4Fa6B3EE5e74619EaCf2614F96B';
const govAbi = require('./gov_abi.json'); // Assuming gov_abi.json is in the same directory
const biggerBoxAbi = require('./biggerbox_abi.json');
const boxAbi = require('./box_abi.json');

// Create a contract object
const govContract = new ethers.Contract(govAddress, govAbi, provider);
const biggerBoxContract = new ethers.Contract(biggerBoxAddress, biggerBoxAbi, provider);
const boxContract = new ethers.Contract(boxAddress, boxAbi, provider);

const contracts = {
    '0xa73AD35f210D1F97b9691E6163De4986bf902A8b': biggerBoxContract,
    '0xa35503e5f050F4Fa6B3EE5e74619EaCf2614F96B': boxContract
};

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

            const eventFragment = govContract.interface.getEvent('ProposalCreated');

            // Decode and process logs
            for (let log of logs) {
                const event = govContract.interface.parseLog(log);
                const namedArgs = {};
                eventFragment.inputs.forEach((input, index) => {
                    if (input.name === 'proposalId') {
                        // Convert proposalId to hex string
                        namedArgs[input.name] = '0x'+event.args[index].toString(16);

                    } else {
                        namedArgs[input.name] = event.args[index];
                    }
                });

                // Check if calldatas exists and decode each item
                if (namedArgs.calldatas) {
                    namedArgs.decodedCalldatas = namedArgs.calldatas.map((calldata, index) => {
                        try {

                            const target = namedArgs.targets[index];
                         
                            if (!contracts[target]) {
                                throw new Error(`Contract not found for address: ${target}`);
                            }

                            // Extract the function signature hash (first 4 bytes of calldata)
                            const signatureHash = calldata.slice(0, 10); // Includes '0x' prefix
                            const functionFragment = contracts[target].interface.getFunction(signatureHash);

                            // Decode the calldata
                            const decodedData = contracts[target].interface.decodeFunctionData(functionFragment, calldata);

                            // Return both the function name and the decoded data
                            return {
                                functionName: functionFragment.name,
                                decodedData: [...decodedData]
                            };
                        } catch (error) {
                            console.error("Error decoding calldata:", error);
                            return { functionName: "Unknown or Error", decodedData: "Error in decoding" };
                        }
                    });
                }
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