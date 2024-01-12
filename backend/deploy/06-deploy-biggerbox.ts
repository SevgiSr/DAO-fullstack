import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployBiggerBox: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("----------------------------------------------------");
  log("Deploying BiggerBox...");

  const biggerBox = await deploy("BiggerBox", {
    from: deployer,
    args: [],
    log: true,
  });

  log(`BiggerBox at ${biggerBox.address}`);

  const boxContract = await ethers.getContractAt("BiggerBox", biggerBox.address);
  const transferTx = await boxContract.transferOwnership("0xfd0A3774207962A2Ce0052737B355120d7C3AACa");
  await transferTx.wait(1);
};

export default deployBiggerBox;
deployBiggerBox.tags = ["all", "biggerbox"];
