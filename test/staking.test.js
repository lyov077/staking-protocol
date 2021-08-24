
const {
    expect
} = require("chai");
const {
    ethers,
    deployments
} = require("hardhat");



describe("Staking contract: ", function () {
    const rewardPerBlock = ethers.utils.parseEther("1");
    let staking, token, accounts;
    before("Before: ", async () => {
        accounts = await ethers.getNamedSigners()

        await deployments.deploy("ClassToken", {
            from: accounts.deployer.address,
            log: false
        })

        token = await ethers.getContract("ClassToken");

        tx = await deployments.deploy("Staking", {
            from: accounts.deployer.address,
            args: [token.address, rewardPerBlock]
        });

        staking = await ethers.getContract("Staking");

        await token.transfer(accounts.caller.address, ethers.utils.parseEther("100000"))
        await token.transfer(accounts.staker.address, ethers.utils.parseEther("100000"))
        await token.approve(staking.address, ethers.constants.MaxUint256)
        await token.connect(accounts.staker).approve(staking.address, ethers.constants.MaxUint256)
        await token.connect(accounts.caller).approve(staking.address, ethers.constants.MaxUint256)
    })

    describe("Initialization", async () => {
        it("Should initialize contract with correct values: ", async () => {
            expect(await staking.stakedToken()).to.equal(token.address);
            expect(await staking.rewardPerBlock()).to.equal(rewardPerBlock);
        })
    })

    describe("distributeReward function: ", async () => {
        let snapshot
        before(async () => {
            snapshot = await ethers.provider.send("evm_snapshot", [])
            console.log("\n" + "===========================" + "\n" + 'snapshotStart', snapshot + "\n" + "============================" + "\n")
        })
        after(async () => {
            await ethers.provider.send("evm_revert", [snapshot])
        })
        it("Shouldn't update state when first investment", async () => {

            const tx = await staking.connect(accounts.staker).stake(ethers.utils.parseEther("50000"))


            expect(await staking.lastRewardBlock())
                .to
                .equal(tx.blockNumber)

            expect(await staking.accRewardPerShare())
                .to
                .equal(0)

        })

        it("Should distribute rewards correctly", async () => {
            let tx = await staking.connect(accounts.caller).stake(ethers.utils.parseEther("50000"))
            let currentBlock = await ethers.provider.getBlockNumber()
            const blockPassed = 10
            const accRewardPerShare = await staking.accRewardPerShare()
            for (let i = currentBlock; i < currentBlock + blockPassed; i++) {
                await ethers.provider.send("evm_mine", [])
            }

            tx = await staking.distributeReward()
            const accReward = await staking.getReward(currentBlock, tx.blockNumber) // qutakvac
            const totalStaked = await staking.totalStaked()
            expect(await staking.lastRewardBlock())
                .to
                .equal(tx.blockNumber)


            expect(await staking.accRewardPerShare())
                .to
                .equal(
                    accRewardPerShare
                        .add(
                            accReward
                                .mul(10 ** 12)
                                .div(totalStaked)
                        )
                )

        })
    })

    describe("Stake function", async () => {
        let snapshot
        before(async () => {
            snapshot = await ethers.provider.send("evm_snapshot", [])
            console.log("\n" + "===========================" + "\n" + 'snapshotStart', snapshot + "\n" + "============================" + "\n")
        })
        after(async () => {
            await ethers.provider.send("evm_revert", [snapshot])
        })
        it("Should stake first user: ", async () => {
            const totalStaked = await staking.totalStaked()
            const caller = await staking.userInfo(accounts.caller.address)
            const accRewardPerShare = await staking.accRewardPerShare()
            const stakeAmount = ethers.utils.parseEther("60000")

            await expect(() => staking.connect(accounts.caller).stake(stakeAmount))
                .to.changeTokenBalances(
                    token,
                    [accounts.caller, staking],
                    [stakeAmount.mul(ethers.constants.NegativeOne), stakeAmount]
                )


            expect(await staking.totalStaked())
                .to
                .equal(totalStaked.add(stakeAmount))

            expect((await staking.userInfo(accounts.caller.address)).amount)
                .to
                .equal(caller.amount.add(stakeAmount))

            expect((await staking.userInfo(accounts.caller.address)).rewardDebt)
                .to
                .equal(caller.amount.mul(accRewardPerShare).div(10 ** 12))
        })

        it("Should emit event Stake with correct args", async () => {
            const caller = await staking.userInfo(accounts.caller.address)
            const stakeAmount = ethers.utils.parseEther("60000")
            await expect(staking.connect(accounts.staker).stake(stakeAmount))
                .to
                .emit(staking, 'Stake')
                .withArgs(accounts.staker.address, caller.amount);
        })
    })
    describe("Unstake function", async () => {
        let snapshot
        before(async () => {

            snapshot = await ethers.provider.send("evm_snapshot", [])
            console.log("\n" + "===========================" + "\n" + 'snapshotStart', snapshot + "\n" + "============================" + "\n")
        })
        after(async () => {
            await ethers.provider.send("evm_revert", [snapshot])
        })
        it("Should reverted with, Staking::bad action", async () => {
            const stakeAmount = ethers.utils.parseEther("50000")
            await staking.connect(accounts.caller).stake(stakeAmount)
            const totalStaked = await staking.totalStaked()
            const caller = await staking.userInfo(accounts.caller.address)
            console.log("🚀 ~ file: staking.test.js ~ line 161 ~ it ~ caller", caller.amount.toString())
            console.log("🚀 ~ file: staking.test.js ~ line 161 ~ it ~ caller", caller.rewardDebt.toString())
            const accRewardPerShare = await staking.accRewardPerShare()


            const stakeAmountBig = ethers.utils.parseEther("600000")
            await expect(staking.connect(accounts.caller).unStake(stakeAmountBig))
                .to
                .be
                .revertedWith("Staking::bad action")

        })
        it("Should", async () => {
            const stakeAmount = ethers.utils.parseEther("50000")
            const unstakeAmount = ethers.utils.parseEther("50000")
            const balance = await token.balanceOf(staking.address)
            console.log("🚀 ~ file: staking.test.js ~ line 84 ~ it ~ balance", balance.toString())
            await staking.connect(accounts.caller).unStake(unstakeAmount)
            // await expect(() => staking.connect(accounts.caller).unStake(unstakeAmount))
            //     .to.changeTokenBalances(
            //         token,
            //         [staking, accounts.caller],
            //         [unstakeAmount.mul(ethers.constants.NegativeOne), unstakeAmount],
            //     )
        })
    })
})



/*

let currentBlock = await ethers.provider.getBlockNumber();
            console.log('currentBlock is: ', currentBlock + "\n")

            let snapshotStart = await ethers.provider.send("evm_snapshot", [])

            for(let i = await ethers.provider.getBlockNumber(); i < 20; i++) {
                await ethers.provider.send("evm_mine", [])
            }

            currentBlock = await ethers.provider.getBlockNumber();
            console.log('currentBlock is: ', currentBlock + "\n")

            await ethers.provider.send("evm_revert", [snapshotStart])
            currentBlock = await ethers.provider.getBlockNumber();
            console.log('currentBlock is: ', currentBlock + "\n")


*/

