import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { HRC20 } from "../typechain";

describe("Token Contract", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const hrc20Contract = await ethers.getContractFactory("HRC20");

    const hrc20: HRC20 = await hrc20Contract.deploy(
      "HRC20",
      "HRC",
      owner.address,
    );

    return { hrc20, owner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    it("Should assign the total supply of tokens to the owner", async function () {
      const { hrc20, owner } = await loadFixture(deployTokenFixture);
      await hrc20.mint(owner.address, 1000);
      const ownerBalance = await hrc20.balanceOf(owner.address);
      expect(await hrc20.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { hrc20, owner, addr1, addr2 } =
        await loadFixture(deployTokenFixture);
      await hrc20.mint(owner.address, 1000);

      // Transfer 50 tokens from owner to addr1
      await expect(hrc20.transfer(addr1.address, 10)).to.changeTokenBalances(
        hrc20,
        [owner, addr1],
        [-10, 10],
      );

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(
        hrc20.connect(addr1).transfer(addr2.address, 10),
      ).to.changeTokenBalances(hrc20, [addr1, addr2], [-10, 10]);
    });

    it("Should emit Transfer events", async function () {
      const { hrc20, owner, addr1, addr2 } =
        await loadFixture(deployTokenFixture);
      await hrc20.mint(owner.address, 1000);

      // Transfer 50 tokens from owner to addr1
      await expect(hrc20.transfer(addr1.address, 10))
        .to.emit(hrc20, "Transfer")
        .withArgs(owner.address, addr1.address, 10);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(hrc20.connect(addr1).transfer(addr2.address, 10))
        .to.emit(hrc20, "Transfer")
        .withArgs(addr1.address, addr2.address, 10);
    });

    it("Should faucet", async function () {
      const { hrc20, owner, addr1, addr2 } =
        await loadFixture(deployTokenFixture);
      expect(await hrc20.balanceOf(addr1.address)).to.equal(0);
      expect(await hrc20.balanceOf(addr2.address)).to.equal(0);

      // Faucet is 10
      await hrc20.mint(addr1.address, 10);
      expect(await hrc20.balanceOf(addr1.address)).to.equal(10);
      await hrc20.mint(addr2.address, 10);
      expect(await hrc20.balanceOf(addr2.address)).to.equal(10);
    });
  });
});
