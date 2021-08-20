const {
  expect
} = require("chai");
const {
  ethers, web3
} = require("hardhat");
const {
  deployments
} = require("hardhat");

describe("ClassToken contract: ", function () {
  let ClassToken, accounts;
  before("Before: ", async () => {
    accounts = await ethers.getNamedSigners()

    tx = await deployments.deploy("ClassToken", {
      from: accounts.deployer.address,
      log: false,
    });

    ClassToken = await ethers.getContract("ClassToken");
  })

  describe("Initialization...", async () => {
    it("Should initialize contract with correct values: ", async () => {
      expect(await ClassToken.name()).to.equal("Class Token");
      expect(await ClassToken.symbol()).to.equal("CLS");
      expect(await ClassToken.totalSupply()).to.equal(ethers.utils.parseEther("300000"));

      expect(await ClassToken.balanceOf(accounts.deployer.address)).to.equal(ethers.utils.parseEther("300000"))
      //burn, mint, burnFrom
    })

  })
  describe("Function mint: ", async () => {
    it("Should add token amount", async () => {
      await ClassToken.mint(accounts.deployer.address, ethers.utils.parseEther("1"))
      const k = await ClassToken.totalSupply();

      expect(await ClassToken.totalSupply())
        .to
        .equal(ethers.utils.parseEther("300001"))
    })

  })
  describe("Function burn: ", async () => {
    it("Should burn tokens", async () => {
      await ClassToken.burn(accounts.deployer.address, ethers.utils.parseEther("1"))
      expect(await ClassToken.totalSupply())
        .to
        .equal(ethers.utils.parseEther("300000"))

    })

  })
  describe("Function burnFrom: ", async () => {
    it("Should reverted with msg,ERC20: burn amount ", async () => {
      await ClassToken.approve(accounts.caller.address, ethers.utils.parseEther("2"))
      const k = await ClassToken.allowance(accounts.deployer.address, accounts.caller.address)
      await expect(ClassToken.burnFrom(accounts.caller.address, ethers.utils.parseEther("5")))
        .to
        .be
        .revertedWith('ERC20: burn amount ')

    })
    it("Should burnFrom", async () => {
      await ClassToken.approve(accounts.caller.address, ethers.utils.parseEther("5"))
      await ClassToken.connect(accounts.caller).burnFrom(accounts.deployer.address, ethers.utils.parseEther("1"))
      expect(await ClassToken.totalSupply())
        .to
        .equal(ethers.utils.parseEther("299999"))

    })

  })
})