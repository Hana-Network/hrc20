import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  networks: {
    hanaAlpha: {
      url: process.env.HANA_ALPHA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    }
  }
};

export default config;
