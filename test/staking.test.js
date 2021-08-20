const {
    expect
} = require("chai");
const {
    ethers, web3
} = require("hardhat");
const {
    deployments
} = require("hardhat");

describe("Staking contract: ", function () {
    let staking, accounts;
    before("Before: ", async () => {
        accounts = await ethers.getNamedSigners()
        const IERC20 = await ethers.getContractAt("IERC20")
        const IERC = await IERC20.deploy()
        await IERC.deployed()
        /*tx = await deployments.deploy("Staking", 10, 100, {
            from: accounts.deployer.address,
            log: false,
        });*/

        const Staking = await ethers.getContractFactory("Staking");
        staking = await Staking.deploy(IERC, 10)

    })
    describe("Initialization...", async () => {
        it("", async () => {
            expect(await staking.rewardPerBlock()).to.equal(10);
        })
    })


})