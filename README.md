# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

# Deploy to Hana Alpha Network

```shell
yarn install

cp .env.example .env
# edit .env to add RPC_URL & PRIVATE_KEY

npx hardhat test
npx hardhat run scripts/deploy.ts --network hanaAlpha
```