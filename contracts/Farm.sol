//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./stake/StakingRewards.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./interface/IFOODNFT.sol";

interface IFarmPower {
    function calculate(uint256 n) external pure returns (uint256);
}

contract Farm is StakingRewards, Ownable, ERC721Holder {
    mapping(uint256 => address) public src;
    mapping(uint256 => address) public dst;
    mapping(address => uint256) public __balances;

    IFarmPower farmpower;

    constructor(
        address st,
        address rt,
        address fp
    ) StakingRewards(st, rt) {
        farmpower = IFarmPower(fp);
    }

    function stake(uint256 id, address pool) public updateReward(pool) {
        uint256 power = IFOODNFT(address(stakingToken)).powers(id);
        require(power > 0, "Power should be greater than 0");
        __balances[pool] += power;
        uint256 delta = farmpower.calculate(__balances[pool]) - _balances[pool];
        _totalSupply += delta;
        _balances[pool] += delta;
        src[id] = msg.sender;
        dst[id] = pool;
        stakingToken.safeTransferFrom(msg.sender, address(this), id);
    }
}
