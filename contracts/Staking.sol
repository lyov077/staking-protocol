// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is Ownable {
    using SafeERC20 for IERC20;
    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt; //minchev user arac verjin gorcoxutyuny , matyanic inchqan e - exel
    }
    uint256 public accRewardPerShare; //yndhanur matyan
    uint256 public rewardPerBlock; //amen bloki hamar talis esqan pox
    uint256 public lastRewardBlock; //qani bloka ancel verjin angam
    uint256 public totalStaked;
    mapping(address => UserInfo) public userInfo;
    IERC20 public stakedToken;
    event Stake(address indexed user, uint256 amount);
    event Claim(address indexed user, uint256 amount);
    event unStaked(address indexed user, uint256 amount);

    constructor(IERC20 _stakedToken, uint256 _rewardPerBlock) {
        stakedToken = _stakedToken;
        rewardPerBlock = _rewardPerBlock;
    }

    function stake(uint256 _amount) external {
        distributeReward();
        stakedToken.safeTransferFrom(msg.sender, address(this), _amount);
        _stake(_amount);
    }

    function distributeReward() public {
        //accamulatedReward poxeluya, lastRewardblocky poxeluya
        if (block.number < lastRewardBlock) {
            return;
        }
        if (totalStaked == 0) {
            lastRewardBlock = block.number;
            return;
        }

        accRewardPerShare =
            accRewardPerShare +
            (getReward(lastRewardBlock, block.number) * 1e12) /
            totalStaked;
        lastRewardBlock = block.number;
    }

    function getReward(uint256 _from, uint256 _to)
        public
        view
        returns (uint256)
    {
        return rewardPerBlock * (_to - _from);
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
        //hashvi u ta rewardnery u rewardDebt hashvi
        UserInfo storage user = userInfo[msg.sender];
        uint256 pending = (user.amount * accRewardPerShare) / 1e12 -
            user.rewardDebt;
        _safeTransferReward(msg.sender, pending);
        emit Claim(msg.sender, pending);
    }

    function claim() external {
        //vercnes qo kutakac rewardnery %-nery
        UserInfo storage user = userInfo[msg.sender];
        distributeReward();
        _claim();
        user.rewardDebt = (user.amount * accRewardPerShare) / 1e12;
    } //KANCHELU PRIVAT CLAIM U DISTRIBUTE

    function unStake(uint256 _amount) external {
        //qo drac gumarnes vercnum
        UserInfo memory user = userInfo[msg.sender];

        require(user.amount >= _amount, "Staking::bad action");
        distributeReward();
        _unstake(_amount);
    }

    function _unstake(uint256 _amount) private {
        UserInfo storage user = userInfo[msg.sender];
        _claim();
        user.amount -= _amount;
        user.rewardDebt = (user.amount - accRewardPerShare) / 1e12;
        totalStaked -= _amount;
        stakedToken.safeTransfer(msg.sender, _amount);

        emit unStaked(msg.sender, _amount);
    }

    function pendingReword() external view returns (uint256) {
        //nayumes inchqan pending reward ka
        UserInfo memory user = userInfo[msg.sender];
        return
            (user.amount *
                accRewardPerShare +
                (getReward(lastRewardBlock, block.number) * 1e12) /
                totalStaked) /
            1e12 -
            user.rewardDebt;
    }

    function _safeTransferReward(address _to, uint256 _amount) private {
        uint256 balance = stakedToken.balanceOf(address(this)) - totalStaked;
        if (_amount > balance) {
            stakedToken.safeTransfer(_to, balance);

            return;
        }
        stakedToken.safeTransfer(_to, _amount);
    }

    function setRewardPerBlock(uint256 _rewardPerBlock) external onlyOwner {
        distributeReward();
        rewardPerBlock = _rewardPerBlock;
    }
}
//claim u unstake
