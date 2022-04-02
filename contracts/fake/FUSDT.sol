//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FUSDT is ERC20, Ownable {
    constructor() ERC20("FAKEUSDT", "USDT") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        require(
            totalSupply() <= 10e6 * (10**decimals()),
            "The total amout should be 10e6"
        );
    }
    function decimals() public pure  override returns (uint8) {
        return 6 ;
    }
}
