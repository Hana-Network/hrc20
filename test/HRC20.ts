import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { HRC20 } from "../typechain/contracts/HRC20";

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("Token contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
    // Get the Signers here.
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call ethers.deployContract and await
    // its waitForDeployment() method, which happens once its transaction has been
    // mined.
    const hrc20Contract = await ethers.getContractFactory("HRC20");

    const hrc20: HRC20 = await hrc20Contract.deploy("HRC20", "HRC");
    await hrc20.setFaucetAmount(10);

    // Fixtures can return anything you consider useful for your tests
    return { hrc20, owner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    it("Should assign the total supply of tokens to the owner", async function () {
      const { hrc20, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await hrc20.balanceOf(owner.address);
      expect(await hrc20.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { hrc20, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      await hrc20.faucet();

      // Transfer 50 tokens from owner to addr1
      await expect(
        hrc20.transfer(addr1.address, 10)
      ).to.changeTokenBalances(hrc20, [owner, addr1], [-10, 10]);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(
        hrc20.connect(addr1).transfer(addr2.address, 10)
      ).to.changeTokenBalances(hrc20, [addr1, addr2], [-10, 10]);
    });

    it("Should emit Transfer events", async function () {
      const { hrc20, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      await hrc20.faucet();

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
      const { hrc20, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      expect(await hrc20.balanceOf(addr1.address)).to.equal(0);
      expect(await hrc20.balanceOf(addr2.address)).to.equal(0);
      
      // Faucet is 10
      await hrc20.connect(addr1).faucet();
      expect(await hrc20.balanceOf(addr1.address)).to.equal(10);
      await hrc20.connect(addr2).faucet();
      expect(await hrc20.balanceOf(addr2.address)).to.equal(10);
    });

  });

});
