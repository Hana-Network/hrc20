import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;
  const btcFaucetAmount = "1000000000000000"; // 0.001 btc = 1e15
  const ethFaucetAmount = "10000000000000000"; // 0.01 eth = 1e16


  const hanaBTC = await ethers.deployContract("HRC20", ["hanaBTC", "hBTC"]);
  const hanaETH = await ethers.deployContract("HRC20", ["hanaETH", "hETH"]);

  await hanaBTC.waitForDeployment();
  await hanaETH.waitForDeployment();

  // set faucetAmount
  await hanaBTC.setFaucetAmount(btcFaucetAmount);
  await hanaETH.setFaucetAmount(ethFaucetAmount);

  // initial faucet by admin address
  await hanaBTC.faucet();
  await hanaETH.faucet();

  const _btcFaucetAmount = await hanaBTC.faucetAmount();
  const _ethFaucetAmount = await hanaETH.faucetAmount();

  console.log(`hanaBTC deployed to ${hanaBTC.target}, faucet: ${_btcFaucetAmount}`);
  console.log(`hanaETH deployed to ${hanaETH.target}, faucet: ${_ethFaucetAmount}`);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
