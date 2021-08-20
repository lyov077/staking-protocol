const {
    expect
} = require("chai");
const {
    ethers, web3
} = require("hardhat");
const {
    deployments
} = require("hardhat");

describe("Test contract: ", function () {
    let test, accounts;
    before("Before: ", async () => {
        accounts = await ethers.getNamedSigners()

        /*tx = await deployments.deploy("Test", {
            from: accounts.deployer.address,
            log: false,
        });*/

        const Test = await ethers.getContractFactory("Test");
        test = await Test.deploy(5)

    })
    describe("", async () => {
        it("", async () => {
            expect(await test.a()).to.equal(5);
        })
    })
})