//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FarmPower {
    function calculate(uint256 n) public pure returns (uint256) {
        uint256 level = n / 1e18;
        if (level > 11) {
            level = 11;
        }
        uint256[12] memory ratios = [
            uint256(1e18),
            1.1e18,
            1.2e18,
            1.3e18,
            1.4e18,
            1.5e18,
            1.6e18,
            1.7e18,
            1.8e18,
            1.9e18,
            2e18,
            2e18
        ];
        return (ratios[level] * n) / 1e18;
    }
}
