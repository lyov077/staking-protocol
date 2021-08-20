// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {
    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
    }

    uint256 public accRewardPerShare;
    uint256 public rewardPerBlock;
    uint256 public lastRewardBlock;
    uint256 public totalStaked;
    mapping(address => UserInfo) public userInfo;

    IERC20 public stakedToken;
    event Stake(address indexed user, uint256 amount);
    event Claim(address indexed user, uint256 amount);
    event UnStaked(address indexed user, uint256 amount);

    constructor(IERC20 _stakedToken, uint256 _rewardPerBlock) {
        stakedToken = _stakedToken;
        rewardPerBlock = _rewardPerBlock;
    }

    function stake(uint256 _amount) external {
        distributeReward();
        stakedToken.transferFrom(msg.sender, address(this), _amount);
        _stake(_amount);
    }

    function claim() external {
        UserInfo storage user = userInfo[msg.sender];
        distributeReward();
        _claim();
        user.rewardDebt = (user.amount * accRewardPerShare) / 1e12;
    }

    function unStake(uint256 _amount) external {
        UserInfo memory user = userInfo[msg.sender];
        require(user.amount >= _amount, "Staking::bad action not enough money");
        distributeReward();
        _unStake(_amount);
    }

    function getReward(uint256 _from, uint256 _to)
        public
        view
        returns (uint256)
    {
        return rewardPerBlock * (_to - _from);
    }

    function distributeReward() public {
        if (block.number < lastRewardBlock) {
            return;
        }

        if (totalStaked == 0) {
            lastRewardBlock = block.number;
            return;
        }
        accRewardPerShare =
            accRewardPerShare +
            ((getReward(lastRewardBlock, block.number)) * 1e12) /
            totalStaked;
        lastRewardBlock = block.number;
    }

    function _stake(uint256 _amount) private {
        UserInfo storage user = userInfo[msg.sender];
        _claim();
        user.amount += _amount;
        totalStaked += _amount;
        user.rewardDebt = (user.amount * accRewardPerShare) / 1e12;
        emit Stake(msg.sender, _amount);
    }

    function _claim() private {
        UserInfo storage user = userInfo[msg.sender];
        uint256 pending = (user.amount * accRewardPerShare) /
            1e12 -
            user.rewardDebt;
        stakedToken.transfer(msg.sender, pending);

        emit Claim(msg.sender, pending);
    }

    function _unStake(uint256 _amount) private {
        UserInfo storage user = userInfo[msg.sender];
        _claim();
        user.amount -= _amount;
        user.rewardDebt = (user.amount * accRewardPerShare) / 1e12;
        totalStaked -= _amount;
        stakedToken.transfer(msg.sender, _amount);
        emit UnStaked(msg.sender, _amount);
    }
}

// add function safeTransfer
// add function safeRewordTranfer
// add function pendingReward
// write test for all functions
