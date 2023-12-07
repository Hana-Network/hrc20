// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./HRC20.sol";

contract HanaFaucet is Ownable, ReentrancyGuard {

    constructor() Ownable(msg.sender) {}

    function withdrawTokens(
        address to,
        address[] memory tokens,
        uint256[] memory amounts
    ) external nonReentrant onlyOwner {
        require(tokens.length == amounts.length, "Faucet: withdrawTokens: tokens and amounts length mismatch");

        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == address(0)) {
                payable(to).transfer(amounts[i]);
                continue;
            }
            HRC20(tokens[i]).mint(to, amounts[i]);
        }
    }

    receive() external payable {}
}
