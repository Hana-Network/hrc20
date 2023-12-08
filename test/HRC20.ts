import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { HRC20 } from "../typechain";
import { min } from "hardhat/internal/util/bigint";

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

  it("can add admin wallet", async function () {
    const { hrc20, owner, addr1 } = await loadFixture(deployTokenFixture);

    const minterRole = await hrc20.MINTER_ROLE();
    await expect(
      hrc20.connect(addr1).grantRole(minterRole, addr1.address),
    ).to.be.revertedWithCustomError(hrc20, "AccessControlUnauthorizedAccount");

    const adminRole = await hrc20.DEFAULT_ADMIN_ROLE();
    await hrc20.grantRole(adminRole, addr1.address);
    expect(await hrc20.hasRole(adminRole, addr1.address)).to.equal(true);

    await hrc20.connect(addr1).grantRole(minterRole, addr1.address);
  });

  it("can add minter wallet", async function () {
    const { hrc20, owner, addr1, addr2 } =
      await loadFixture(deployTokenFixture);

    await expect(
      hrc20.connect(addr1).mint(addr2.address, 1000),
    ).to.be.revertedWithCustomError(hrc20, "AccessControlUnauthorizedAccount");

    const minterRole = await hrc20.MINTER_ROLE();
    await hrc20.grantRole(minterRole, addr1.address);
    expect(await hrc20.hasRole(minterRole, addr1.address)).to.equal(true);

    await hrc20.connect(addr1).mint(addr2.address, 1000);
  });

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
