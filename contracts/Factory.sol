// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Token} from "./Token.sol";

contract Factory {
    uint256 public immutable fee;
    address public owner;

    event TokenCreated(address indexed token);

    constructor(uint256 _fee) {
        fee = _fee;
        owner = msg.sender;
    }

    function create(string memory _name, string memory _symbol) external {
        Token token = new Token{salt: msg.sender}(_name, _symbol);
        emit TokenCreated(address(token));
    }

    function buy(address _token, uint256 _amount) external payable {}

    function sell(address _token, uint256 _amount) external {}
}