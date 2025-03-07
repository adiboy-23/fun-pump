const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { expect } = require("chai")

describe("Factory", function () {
   // Factory contract variables
   const FEE = ethers.parseUnits("0.01", 18)

   // Token contract variables
   const NAME = "Adiboy"
   const SYMBOL = "ADI"

  async function deployFactoryFixture() {
    // Get accounts
    const [deployer, creator, buyer] = await ethers.getSigners()

    // Deploy factory
    const Factory = await ethers.getContractFactory("Factory")
    const factory = await Factory.deploy(FEE)
     // Create token
     const transaction = await factory.connect(creator).create(NAME, SYMBOL, { value: FEE })
     await transaction.wait()
 
     // Get token address
     const tokenAddress = await factory.creatorToTokens(creator.address, 0)
     const token = await ethers.getContractAt("Token", tokenAddress)

    // Return values
    return { factory, token, deployer, creator, buyer }
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

  describe("Creating", function () {
   
    it("Should set the owner", async function () {
      const { factory, token } = await loadFixture(deployFactoryFixture)
      expect(await token.owner()).to.equal(await factory.getAddress())
    })

    it("Should set the creator", async function () {
      const { token, creator } = await loadFixture(deployFactoryFixture)
      expect(await token.creator()).to.equal(creator.address)
    })

    it("Should set the supply", async function () {
      const { factory, token } = await loadFixture(deployFactoryFixture)

      const totalSupply = ethers.parseUnits("1000000", 18)

      expect(await token.balanceOf(await factory.getAddress())).to.equal(totalSupply)
    })

    it("Should update ETH balance", async function () {
      const { factory } = await loadFixture(deployFactoryFixture)

      const balance = await ethers.provider.getBalance(await factory.getAddress())

      expect(balance).to.equal(FEE)
    })
    it("Should set buying status", async function () {
        const { factory, token } = await loadFixture(deployFactoryFixture)
  
        const sale = await factory.tokenToSale(await token.getAddress())
  
        expect(sale.isOpen).to.equal(true)
      })
  })


  describe("Buying", function () {

    const AMOUNT = ethers.parseUnits("1", 18)
    const COST = ethers.parseUnits("0.01", 18)

    async function buyTokenFixture() {
      const { factory, token, buyer } = await deployFactoryFixture()

      // Buy tokens
      const transaction = await factory.connect(buyer).buy(await token.getAddress(), AMOUNT, { value: COST })
      await transaction.wait()

      return { factory, token, buyer }
    }

    it("Should update ETH balance", async function () {
        const { factory } = await loadFixture(buyTokenFixture)

        const balance = await ethers.provider.getBalance(await factory.getAddress())

      // Remember the fee to initially create the token + someone who bought
      expect(balance).to.equal(FEE + COST)

    })

    it("Should update token balances", async function () {
        const { token, buyer } = await loadFixture(buyTokenFixture)

        const balance = await token.balanceOf(buyer.address)
  
        expect(balance).to.equal(AMOUNT)
      })
  
      it("Should update token sale", async function () {
        const { factory, token } = await loadFixture(buyTokenFixture)
  
        const sale = await factory.tokenToSale(await token.getAddress())
  
        expect(sale.sold).to.equal(AMOUNT)
        expect(sale.raised).to.equal(COST)
        expect(sale.isOpen).to.equal(true)
      })
  
      it("Should increase base cost", async function () {
        const { factory, token } = await loadFixture(buyTokenFixture)
  
        const sale = await factory.tokenToSale(await token.getAddress())
        const cost = await factory.getCost(sale.sold)
  
        expect(cost).to.be.equal(ethers.parseUnits("0.002"))

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