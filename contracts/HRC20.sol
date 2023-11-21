// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (security/Pausable.sol)

pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Hana Improvement Proposals Contracts
contract HRC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    // use for faucet
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}