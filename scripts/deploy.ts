import { ethers } from "hardhat";

async function main() {
  const faucet = await ethers.deployContract("HanaFaucet", [
    process.env.FAUCET_ADMIN_ADDRESS ?? "",
  ]);
  await faucet.waitForDeployment();
  console.log(`HanaFaucet deployed to ${faucet.target}`);

  const hanaBTC = await ethers.deployContract("HRC20", [
    "hanaBTC",
    "hBTC",
    faucet.target,
  ]);
  const hanaETH = await ethers.deployContract("HRC20", [
    "hanaETH",
    "hETH",
    faucet.target,
  ]);
  const hanaUSDC = await ethers.deployContract("HRC20", [
    "hanaUSDC",
    "hUSDC",
    faucet.target,
  ]);

  await hanaBTC.waitForDeployment();
  await hanaETH.waitForDeployment();
  await hanaUSDC.waitForDeployment();

  console.log(`hanaBTC deployed to ${hanaBTC.target}`);
  console.log(`hanaETH deployed to ${hanaETH.target}`);
  console.log(`hanaUSDC deployed to ${hanaUSDC.target}`);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
