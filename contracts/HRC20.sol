// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (security/Pausable.sol)

pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// Hana Improvement Proposals Contracts
contract HRC20 is ERC20, AccessControl {
    // Create a new role identifier for the minter role
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint256 public faucetAmount;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function setFaucetAmount(uint256 _faucetAmount) onlyRole(ADMIN_ROLE) public {
        faucetAmount = _faucetAmount;
    }

    function faucet() public {
        _mint(msg.sender, faucetAmount);
    }
}