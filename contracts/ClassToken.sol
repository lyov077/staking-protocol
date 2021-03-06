//SPDX-License-Identifier: MIT

pragma solidity 0.8.6;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ClassToken is ERC20, Ownable {
    constructor() ERC20("Class Token", "CLS") {
        _mint(msg.sender, 300000 ether);
    }

    function mint(address _account, uint256 _amount) external onlyOwner {
        _mint(_account, _amount);
    }

    function burn(address _account, uint256 _amount) external {
        _burn(_account, _amount);
    }

    function burnFrom(address _account, uint256 _amount) external {
        uint256 currentAllowance = allowance(_account, msg.sender);
        require(currentAllowance >= _amount, "ERC20: burn amount ");
        unchecked {
            _approve(_account, msg.sender, currentAllowance - _amount);
        }
        _burn(_account, _amount);
    }
    
}
