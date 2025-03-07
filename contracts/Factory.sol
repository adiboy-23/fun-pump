// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.27;

import {Token} from "./Token.sol";

contract Factory {
    uint256 public immutable fee;
    address public owner;

     mapping(address => address[]) public creatorToTokens;

    event TokenCreated(address indexed token);

    constructor(uint256 _fee) {
        fee = _fee;
        owner = msg.sender;
    }

   function create(
        string memory _name,
        string memory _symbol
    ) external payable {
        require(msg.value >= fee, "Factory: Creator fee not met");

        bytes32 salt = keccak256(abi.encodePacked(msg.sender, _name, _symbol));

        Token token = new Token{salt: salt}(
            msg.sender,
            _name,
            _symbol,
            1_000_000 ether
        );

        creatorToTokens[msg.sender].push(address(token));
        emit TokenCreated(address(token));
    }

    function buy(address _token, uint256 _amount) external payable {}

    function sell(address _token, uint256 _amount) external {}

     function withdraw() external {}
}