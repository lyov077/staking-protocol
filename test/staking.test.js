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
    let staking, accounts, token;
    const rewardPerBlock = 5
    before("Before: ", async () => {
        accounts = await ethers.getNamedSigners()
        tx = await deployments.deploy("ClassToken", {
            from: accounts.deployer.address,
            log: false,
        });
        token = await ethers.getContract("ClassToken", accounts.deployer.caller);
        // const Staking = await ethers.getContractFactory("Staking")
        // staking = await Staking.deploy(token.address, rewardPerBlock)
        tx = await deployments.deploy("Staking", {
            from: accounts.deployer.address,
            args: [token.address, rewardPerBlock]
        });

        staking = await ethers.getContract("Staking");

    })
    describe("Initialization...", async () => {
        it("", async () => {
            expect(await staking.stakedToken()).to.equal(token.address);
            expect(await staking.rewardPerBlock()).to.equal(rewardPerBlock);
        })
        describe("distributeReward function: ", async () => {
            it("Shouldn't update state if block number less than last reward block", async () => { })
            // let currentBlock = await ethers.provider.getBlockNumber();
            // console.log('currentBlock is: ', currentBlock + "\n")
            it("Should update lastRewardBlock to block.number", async () => {
                const lastRewardBlock1 = await staking.lastRewardBlock()
                console.log("lastRewardBlock :", lastRewardBlock1.toString())
                const currentBlock1 = await ethers.provider.getBlockNumber();
                console.log('currentBlock is: ', currentBlock1 + "\n")
                let snapshotStart = await ethers.provider.send("evm_snapshot", [])

                // for (let i = await ethers.provider.getBlockNumber(); i < 20; i++) {
                //     await ethers.provider.send("evm_mine", [])
                // }
                expect(await staking.totalStaked()).to.equal(0);
                await staking.distributeReward()
                expect(await staking.lastRewardBlock()).to.equal(await ethers.provider.getBlockNumber())
                // const lastRewardBlock2 = await staking.lastRewardBlock()
                // console.log("lastRewardBlock is: after distribute", lastRewardBlock2.toString())
                // const currentBlock2 = await ethers.provider.getBlockNumber();
                // console.log('currentBlock is: after distribute', currentBlock2 + "\n")

                // await ethers.provider.send("evm_revert", [snapshotStart])

                // const lastRewardBlock3 = await staking.lastRewardBlock()
                // console.log('lastRewardBlock is: after revert', lastRewardBlock3.toString())
                // const currentBlock3 = await ethers.provider.getBlockNumber();
                // console.log('currentBlock is: after revert', currentBlock3)

                // await staking.distributeReward()
                // expect(lastRewardBlock2).to.equal(3)

                // await staking.distributeReward()
                // await staking.distributeReward()
                // expect(lastRewardBlock2).to.equal(3)
            })
        })
        describe("Stake: ", async () => {
            it("Should ", async () => {
                //caller accountin uni 12 eth, voric contractin approve araca 3 eth,
                k = 10
                await token.connect(accounts.deployer).transfer(accounts.caller.address, ethers.utils.parseEther("12"))
                await token.connect(accounts.caller).approve(staking.address, ethers.utils.parseEther("3"))

                //arajin stake 1 eth
                await staking.connect(accounts.caller).stake(5)

                userInfos = await staking.userInfo(accounts.caller.address);
                accRewardPerShare = await staking.accRewardPerShare();
                total = await staking.totalStaked()
                console.log("amount:", userInfos[0].toString())
                console.log("rewardDebt:", userInfos[1].toString())
                console.log("accRewardPerShare:", accRewardPerShare.toString())
                console.log("total:", total.toString() + "\n")
                console.log("*******************************************************************")
                currentBlockGetReward = await ethers.provider.getBlockNumber();
                console.log("currentBlockGetReward before: ", currentBlockGetReward.toString())
                lastRewardBlockGetReward = await staking.lastRewardBlock();
                console.log("lastRewardBlockGetReward before: ", lastRewardBlockGetReward.toString())

                for (let i = await ethers.provider.getBlockNumber(); i < k; i++) {
                    await ethers.provider.send("evm_mine", [])
                }
                k += 4
                currentBlockGetReward = await ethers.provider.getBlockNumber();
                console.log("currentBlockGetReward after: ", currentBlockGetReward.toString())
                lastRewardBlockGetReward = await staking.lastRewardBlock();
                console.log("lastRewardBlockGetReward after: ", lastRewardBlockGetReward.toString() + "\n")

                await staking.connect(accounts.caller).stake(5)

                userInfos = await staking.userInfo(accounts.caller.address);
                accRewardPerShare = await staking.accRewardPerShare();
                total = await staking.totalStaked()
                console.log("amount:", userInfos[0].toString())
                console.log("rewardDebt:", userInfos[1].toString())
                console.log("accRewardPerShare:", accRewardPerShare.toString())
                console.log("total:", total.toString() + "\n")
                console.log("*******************************************************************")
                currentBlockGetReward = await ethers.provider.getBlockNumber();
                console.log("currentBlockGetReward before: ", currentBlockGetReward.toString())
                lastRewardBlockGetReward = await staking.lastRewardBlock();
                console.log("lastRewardBlockGetReward before: ", lastRewardBlockGetReward.toString())

                for (let i = await ethers.provider.getBlockNumber(); i < k; i++) {
                    await ethers.provider.send("evm_mine", [])
                }
                k += 4
                currentBlockGetReward = await ethers.provider.getBlockNumber();
                console.log("currentBlockGetReward after: ", currentBlockGetReward.toString())
                lastRewardBlockGetReward = await staking.lastRewardBlock();
                console.log("lastRewardBlockGetReward after: ", lastRewardBlockGetReward.toString() + "\n")
                await staking.connect(accounts.caller).stake(5)

                userInfos = await staking.userInfo(accounts.caller.address);
                accRewardPerShare = await staking.accRewardPerShare();
                total = await staking.totalStaked()
                console.log("amount:", userInfos[0].toString())
                console.log("rewardDebt:", userInfos[1].toString())
                console.log("accRewardPerShare:", accRewardPerShare.toString())
                console.log("total:", total.toString() + "\n")
                console.log("*******************************************************************")
            })
        })
        describe("GetReward function", async () => {
            it("Should give reward ", async () => {
                let snapshotStart = await ethers.provider.send("evm_snapshot", [])
                currentBlockGetReward = await ethers.provider.getBlockNumber();
                console.log("🚀 ~ file: staking.test.js ~ line 98 ~ it ~ currentBlockGetReward", currentBlockGetReward.toString())
                for (let i = await ethers.provider.getBlockNumber(); i < 20; i++) {
                    await ethers.provider.send("evm_mine", [])
                }
                currentBlockGetReward = await ethers.provider.getBlockNumber();
                lastRewardBlockGetReward = await staking.lastRewardBlock();
                result = (currentBlockGetReward - lastRewardBlockGetReward) * rewardPerBlock
                expect(await staking.getReward(lastRewardBlockGetReward, currentBlockGetReward)).to.equal(result)
                await ethers.provider.send("evm_revert", [snapshotStart])

            })
        })

    })


})