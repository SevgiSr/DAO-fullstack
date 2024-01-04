import { ethers } from "ethers";

async function getContract(contract) {
  const { ethereum } = window;
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const contractObj = new ethers.Contract(
    contract.address,
    contract.abi,
    signer
  );

  return contractObj;
}

export default getContract;
