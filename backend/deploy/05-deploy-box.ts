import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployBox: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("----------------------------------------------------");
  log("Deploying Box...");

  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
  });

  log(`Box at ${box.address}`);

  const boxContract = await ethers.getContractAt("Box", box.address);
  const timeLock = await ethers.getContract("TimeLock");
  const transferTx = await boxContract.transferOwnership(
    await timeLock.getAddress()
  );
  await transferTx.wait(1);
};

export default deployBox;
deployBox.tags = ["all", "box"];
