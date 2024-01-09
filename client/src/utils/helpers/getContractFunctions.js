const getContractFunctions = (abi) => {
  const callableFunctions = abi.filter((item) => item.type === "function");

  const functionDetails = callableFunctions.map((func) => {
    return {
      name: func.name,
      inputs: func.inputs.map((input) => ({
        name: input.name,
        type: input.type,
      })),
      stateMutability: func.stateMutability,
    };
  });

  return functionDetails;
};
export default getContractFunctions;
