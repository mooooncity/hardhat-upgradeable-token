// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {TokenV1} from "./TokenV1.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";

/// @custom:oz-upgrades-from TokenV1
contract TokenV2 is TokenV1, PausableUpgradeable {
    /// @custom:oz-upgrades-validate-as-initializer
    function initializeV2() external reinitializer(2) {
        __Pausable_init();
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _update(address from, address to, uint256 value) internal override {
        require(!paused(), "paused");
        super._update(from, to, value);
    }
}
