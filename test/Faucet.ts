import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Faucet ", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const faucetContract = await ethers.getContractFactory("HanaFaucet");
    const hrc20Contract = await ethers.getContractFactory("HRC20");

    const faucet = await faucetContract.deploy();
    await owner.sendTransaction({
      to: await faucet.getAddress(),
      value: ethers.parseEther("100"),
    });

    const hbtc = await hrc20Contract.deploy(
      "Hana BTC",
      "HBTC",
      await faucet.getAddress(),
    );
    const heth = await hrc20Contract.deploy(
      "Hana ETH",
      "HETH",
      await faucet.getAddress(),
    );

    return { faucet, hbtc, heth, owner, addr1, addr2 };
  }

  it("can receive native token", async function () {
    const { faucet, owner } = await loadFixture(deployTokenFixture);

    await expect(
      owner.sendTransaction({
        to: await faucet.getAddress(),
        value: ethers.parseEther("100"),
      }),
    ).to.changeEtherBalance(faucet, ethers.parseEther("100"));
  });

  it("native token faucet", async function () {
    const { faucet, addr1 } = await loadFixture(deployTokenFixture);

    await expect(
      faucet.withdrawTokens(addr1.address, [ethers.ZeroAddress], [100]),
    ).to.changeEtherBalances([faucet, addr1], [-100, 100]);
  });

  it("single token faucet", async function () {
    const { faucet, hbtc, addr1 } = await loadFixture(deployTokenFixture);

    await expect(
      faucet.withdrawTokens(addr1.address, [await hbtc.getAddress()], [100]),
    ).to.changeTokenBalance(hbtc, addr1, 100);
  });

  it("native and multiple token faucet", async function () {
    const { faucet, hbtc, heth, addr1 } = await loadFixture(deployTokenFixture);

    const tx = faucet.withdrawTokens(
      addr1.address,
      [ethers.ZeroAddress, await hbtc.getAddress(), await heth.getAddress()],
      [100, 200, 300],
    );
    await expect(tx).to.changeEtherBalances([faucet, addr1], [-100, 100]);
    await expect(tx).to.changeTokenBalance(hbtc, addr1, 200);
    await expect(tx).to.changeTokenBalance(heth, addr1, 300);
  });
});
