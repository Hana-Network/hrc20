import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-watcher";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  typechain: {
    outDir: "typechain",
    target: "ethers-v6",
  },
  networks: {
    local: {
      chainId: 1337,
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
      },
    },
    hanaAlpha: {
      url: process.env.HANA_ALPHA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  watcher: {
    test: {
      tasks: [{ command: "test", params: { testFiles: ["{path}"] } }],
      files: ["./test/**/*"],
      verbose: true,
      clearOnStart: true,
      start: "echo Running my test task now..",
    },
  },
};

export default config;
