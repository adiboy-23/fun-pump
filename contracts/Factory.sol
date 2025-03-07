// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.27;

import {Token} from "./Token.sol";
import "hardhat/console.sol";

contract Factory {
    uint256 public constant TARGET = 1 ether;
    uint256 public constant TOKEN_LIMIT = 600_000 ether;
    uint256 public immutable fee;
    address public owner;

     mapping(address => address[]) public creatorToTokens;
     mapping(address => TokenSale) public tokenToSale;

    struct TokenSale {
        uint256 sold;
        uint256 raised;
        bool isOpen;
    }

    event Created(address indexed token);
    event Buy(address indexed token, uint256 amount);
    event Sell(address indexed token, uint256 amount);

    constructor(uint256 _fee) {
        fee = _fee;
        owner = msg.sender;
    }

    function getCost(uint256 _sold) public pure returns (uint256) {
        uint256 floor = 0.001 ether;
        uint256 step = 0.001 ether;
        uint256 cost = (step * (_sold / 10 ** 18)) + floor;
        return cost;
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

        // Create the sale.
        TokenSale memory sale = TokenSale(0, 0, true);

        // Save who created the token.

        creatorToTokens[msg.sender].push(address(token));
         // Save the sale to mapping.
        tokenToSale[address(token)] = sale;

        emit Created(address(token));
    }

    function buy(address _token, uint256 _amount) external payable {
        TokenSale storage sale = tokenToSale[_token];

        require(sale.isOpen == true, "Factory: Buying closed");
        require(_amount <= 100 ether, "Factory: Amount Exceeded");

        // Calculate the price of 1 token based on the total bought.
        uint256 cost = getCost(sale.sold);

        // Determine the total price for X amount.
        uint256 price = cost * (_amount / 10 ** 18);

        // Check to ensure enough ETH is sent.
        require(msg.value >= price, "Factory: Insufficient ETH received");

        // Update contract states.
        sale.sold += _amount;
        sale.raised += msg.value;

        // If we have reached our ETH goal or buy limit, stop allowing buys.
        if (sale.sold >= TOKEN_LIMIT || sale.raised >= TARGET) {
            sale.isOpen = false;
        }

        // Transfer tokens to buyer.
        Token(_token).transfer(msg.sender, _amount);

        emit Buy(_token, _amount);
    }

    function sell(address _token, uint256 _amount) external {}

     function withdraw() external {}
}