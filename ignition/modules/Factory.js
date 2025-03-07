// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const FEE = 10

module.exports = buildModule("LockModule", (m) => {
  // Get parameters
  const fee = m.getParameter("fee", FEE);

  // Define factory
  const factory = m.contract("Factory", [fee]);

  // Return factory
  return { factory };
})