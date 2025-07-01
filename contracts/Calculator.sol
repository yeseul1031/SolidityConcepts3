// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AbstractCalculator.sol";

contract Calculator is AbstractCalculator {
    // override 키워드 추가
    function calculate(uint256 a, uint256 b, string memory operation) public pure override returns (uint256) {
        bytes32 opHash = keccak256(abi.encodePacked(operation));
        
        if (opHash == keccak256(abi.encodePacked("add"))) {
            return add(a, b);
        } else if (opHash == keccak256(abi.encodePacked("subtract"))) {
            return subtract(a, b);
        } else if (opHash == keccak256(abi.encodePacked("multiply"))) {
            return multiply(a, b);
        } else if (opHash == keccak256(abi.encodePacked("divide"))) {
            return divide(a, b);
        } else {
            revert("Invalid operation");
        }
    }
}
