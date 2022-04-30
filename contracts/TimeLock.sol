//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TimeLock is Ownable {
    IERC20 token;
    address immutable holder;
    uint256 lockTime = 365 days;
    uint256 releaseTime = 2 * 365 days;
    uint256 currentTime;
    struct User {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 createdAt;
    }

    mapping(address => User) public users;

    constructor(address t, address h){
        token = IERC20(t);
        holder = h;
    }

    function setCurrentTime(uint256 t) public onlyOwner {
        currentTime = block.timestamp  +  t * 1 days;
    }

    function getCurrentTime() public view returns (uint256) {
        if (currentTime > 0) {
            return currentTime;
        }

        return block.timestamp;
    }

    function vest(address to, uint256 amount) public onlyOwner{
        User memory user;
        user.createdAt = getCurrentTime();
        user.totalAmount = amount;
        users[to] = user;
    }

    function release() public returns (User memory) {
        User memory user = users[msg.sender];
        require(getCurrentTime() - user.createdAt > lockTime, "your token not to release time");
        require(user.releasedAmount < user.totalAmount, "your token has all released");

        if (getCurrentTime() - user.createdAt > lockTime)  {
                uint256 current = getCurrentTime();
                if (current - user.createdAt - lockTime > releaseTime) {
                    current = user.createdAt + lockTime + releaseTime;
                }

                uint256 amount;
                amount = (user.totalAmount * (current - user.createdAt - lockTime)) / releaseTime  - user.releasedAmount;
                SafeERC20.safeTransferFrom(token, holder, msg.sender, amount);
                user.releasedAmount += amount;
                users[msg.sender] = user;
        }

        return user;
    }
}