//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CAT is ERC20, Ownable {
    constructor() ERC20("CAT COIN", "CAT") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        require(
            totalSupply() <= 2e9 * (10**decimals()),
            "The total amout should be 2e9"
        );
    }
    
}
