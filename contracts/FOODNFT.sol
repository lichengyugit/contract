//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract FOODNFT is ERC721PresetMinterPauserAutoId {
    mapping(uint256 => uint256) public powers;
    mapping(address => bool) public whitelist;

    constructor()
        ERC721PresetMinterPauserAutoId("FOODNFT", "NFT", "www.abc.com")
    {}

    function isApprovedForAll(address owner, address operator)
        public
        view
        override(ERC721, IERC721)
        returns (bool)
    {
        if (whitelist[operator]) {
            return true;
        }
        return super.isApprovedForAll(owner, operator);
    }

    function set_power(uint256 id, uint256 power) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Insufficient permissions"
        );
        require(powers[id] == 0, "Cannot change the original power");
        require(power > 0, "TODO:...");
        powers[id] = power;
    }

    function set_whitelist(address operator, bool val) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Insufficient permissions"
        );
        whitelist[operator] = val;
    }

    function mint_batch(uint256 num, address to) public {
        for (uint256 i = 0; i < num; i++) {
            mint(to);
        }
    }
}
