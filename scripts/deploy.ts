import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;


  const hanaBTC = await ethers.deployContract("HRC20", ["hanaBTC", "hBTC"]);
  const hanaETH = await ethers.deployContract("HRC20", ["hanaETH", "hETH"]);

  await hanaBTC.waitForDeployment();
  await hanaETH.waitForDeployment();

  console.log(`hanaBTC deployed to ${hanaBTC.target}`);
  console.log(`hanaETH deployed to ${hanaETH.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
