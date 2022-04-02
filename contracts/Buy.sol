//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Buy is Ownable {
    using SafeERC20 for IERC20;
    address immutable FUSDT;
    address immutable FOODNFT;

    mapping(uint256 => uint256) public prices;

    constructor(address fusdt ,address foodnft){
        FUSDT =  fusdt;
        FOODNFT  = foodnft;
    }

    function set_price(uint id , uint price) public onlyOwner{
        prices[id] = price;
    }

    function buy(uint id) public{
        IERC20(FUSDT).safeTransferFrom(msg.sender, address(this), prices[id]); 
        IERC721(FOODNFT).safeTransferFrom(address(this), msg.sender, id);
    }


}
