const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { expect } = require("chai")

describe("Factory", function () {
  const FEE = 10

  async function deployFactoryFixture() {
    // Get accounts
    const [deployer, creator, buyer] = await ethers.getSigners()

    // Deploy factory
    const Factory = await ethers.getContractFactory("Factory")
    const factory = await Factory.deploy(FEE)

    // Return values
    return { factory, deployer, creator, buyer }
  }

  describe("Deployment", function () {
    it("Should set the fee", async function () {
      const { factory } = await loadFixture(deployFactoryFixture)
      expect(await factory.fee()).to.equal(FEE)
    })

    it("Should set the owner", async function () {
      const { factory, deployer } = await loadFixture(deployFactoryFixture)
      expect(await factory.owner()).to.equal(deployer.address)
    })
  })

  describe("Buying", function () {
    it("Should update ETH balance", async function () {
      const { factory } = await loadFixture(deployFactoryFixture)

    })

    it("Should update token balances", async function () {
      const { factory } = await loadFixture(deployFactoryFixture)

    })
  })

  describe("Selling", function () {
    it("Should update ETH balance", async function () {
      const { factory } = await loadFixture(deployFactoryFixture)

    })

    it("Should update token balances", async function () {
      const { factory } = await loadFixture(deployFactoryFixture)

    })
  })
})