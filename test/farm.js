const { expect } = require("chai");
const { Signer } = require("ethers");
const { ethers } = require("hardhat");

describe("Farm", function () {

  it("测试挖矿，先质押一个foodcat算力为5，在质押一个foodcat算力为2，算力加权是否正常", async function () {
    const CAT = await ethers.getContractFactory("CAT");
    const FOODNFT = await ethers.getContractFactory("FOODNFT");
    const FarmPower = await ethers.getContractFactory("FarmPower");
    const Farm = await ethers.getContractFactory("Farm");
    const Buy = await ethers.getContractFactory("Buy");
    const FUSDT = await ethers.getContractFactory("FUSDT");
    const cat = await CAT.deploy();
    await cat.deployed();
    const foodnft = await FOODNFT.deploy();
    await foodnft.deployed();
    const farmpower = await FarmPower.deploy();
    await farmpower.deployed();
    const farm = await Farm.deploy(foodnft.address, cat.address, farmpower.address);
    await farm.deployed();
    const fakeusdt = await FUSDT.deploy();
    await fakeusdt.deployed();
    const buy = await Buy.deploy(fakeusdt.address, foodnft.address);
    await buy.deployed();


    console.log(`CAT address: ${cat.address}`);
    console.log(`FOODNFT address: ${foodnft.address}`);
    console.log(`FarmPower address: ${farmpower.address}`);
    console.log(`Farm address: ${farm.address}`);
    console.log(`Buy address: ${buy.address}`);
    console.log(`FakeUSDT address: ${fakeusdt.address}`);

    //step1，todo：将需要挖矿的cat打入farm合约中

    const signers = await ethers.getSigners();
    await cat.connect(signers[0]).mint(farm.address, ethers.utils.parseEther("10000"));

    expect(await cat.totalSupply()).to.equal(ethers.utils.parseEther("10000"));

    expect(await cat.balanceOf(farm.address)).to.equal(ethers.utils.parseEther("10000"));


    //step3


    const tx1 = await fakeusdt.connect(signers[0]).mint(signers[1].address, '1000');
    const tx2 = await fakeusdt.connect(signers[0]).mint(signers[2].address, '1000');
    await tx1.wait();
    await tx2.wait();
    expect(await fakeusdt.balanceOf(signers[1].address)).to.equal("1000")
    expect(await fakeusdt.balanceOf(signers[2].address)).to.equal("1000")

    //nft  mint
    const foodntf = await foodnft.connect(signers[0]).mint_batch(2, buy.address);
    await foodntf.wait();
    expect(await foodnft.balanceOf(buy.address)).to.equal(2);


    await buy.connect(signers[0]).set_price(0, "100");
    await buy.connect(signers[0]).set_price(1, "100");

    await foodnft.connect(signers[0]).set_power(0, ethers.utils.parseEther("5"));
    await foodnft.connect(signers[0]).set_power(1, ethers.utils.parseEther("2"));


    expect(await buy.prices(0)).to.equal("100");
    expect(await buy.prices(1)).to.equal("100");
    expect(await foodnft.powers(0)).to.equal(ethers.utils.parseEther("5"));
    expect(await foodnft.powers(1)).to.equal(ethers.utils.parseEther("2"));


    await fakeusdt.connect(signers[1]).approve(buy.address, "1000");
    await fakeusdt.connect(signers[2]).approve(buy.address, "1000");

    await buy.connect(signers[1]).buy(0);
    await buy.connect(signers[2]).buy(1);


    expect(await foodnft.balanceOf(buy.address)).to.equal(0);


    await foodnft.connect(signers[0]).set_whitelist(farm.address, true);


    await farm.connect(signers[1]).stake(0, signers[1].address);
    await farm.connect(signers[2]).stake(1, signers[1].address);


    expect(await foodnft.balanceOf(signers[1].address)).to.equal(0);
    expect(await foodnft.balanceOf(signers[2].address)).to.equal(0);

    expect(await foodnft.balanceOf(farm.address)).to.equal(2);

    expect(await farm.__balances(signers[1].address)).to.equal(ethers.utils.parseEther("7"));
    expect(await farm._balances(signers[1].address)).to.equal(ethers.utils.parseEther("11.9"));



    await farm.set_pool_name(signers[0].address,"123");
  
    var name1 = await farm.pool_names(signers[0].address);
    console.log(`pool name : ` + name1);
    var name2 = await farm.pool_names(signers[1].address);
    console.log(`pool name : ` + name2);
    var name3 = await farm.pool_names("0x0000000000000000000000000000000000000000");
    console.log(`pool name : ` + name3);

  })
  it("测试挖矿，先质押一个foodcat算力为5，在质押一个foodcat算力为2，在质押一个foodcat算力为5，算力加权是否正常", async function () {
    const CAT = await ethers.getContractFactory("CAT");
    const FOODNFT = await ethers.getContractFactory("FOODNFT");
    const FarmPower = await ethers.getContractFactory("FarmPower");
    const Farm = await ethers.getContractFactory("Farm");
    const Buy = await ethers.getContractFactory("Buy");
    const FUSDT = await ethers.getContractFactory("FUSDT");
    const cat = await CAT.deploy();
    await cat.deployed();
    const foodnft = await FOODNFT.deploy();
    await foodnft.deployed();
    const farmpower = await FarmPower.deploy();
    await farmpower.deployed();
    const farm = await Farm.deploy(foodnft.address, cat.address, farmpower.address);
    await farm.deployed();
    const fakeusdt = await FUSDT.deploy();
    await fakeusdt.deployed();
    const buy = await Buy.deploy(fakeusdt.address, foodnft.address);
    await buy.deployed();
    console.log(`CAT address: ${cat.address}`);
    console.log(`FOODNFT address: ${foodnft.address}`);
    console.log(`FarmPower address: ${farmpower.address}`);
    console.log(`Farm address: ${farm.address}`);
    console.log(`Buy address: ${buy.address}`);
    console.log(`FakeUSDT address: ${fakeusdt.address}`);
    const signers = await ethers.getSigners();
    await cat.connect(signers[0]).mint(farm.address, ethers.utils.parseEther("10000"));
    expect(await cat.totalSupply()).to.equal(ethers.utils.parseEther("10000"));
    expect(await cat.balanceOf(farm.address)).to.equal(ethers.utils.parseEther("10000"));
    const tx1 = await fakeusdt.connect(signers[0]).mint(signers[1].address, '1000');
    const tx2 = await fakeusdt.connect(signers[0]).mint(signers[2].address, '1000');
    const tx3 = await fakeusdt.connect(signers[0]).mint(signers[3].address, '1000');
    await tx1.wait();
    await tx2.wait();
    await tx3.wait();
    expect(await fakeusdt.balanceOf(signers[1].address)).to.equal("1000")
    expect(await fakeusdt.balanceOf(signers[2].address)).to.equal("1000")
    expect(await fakeusdt.balanceOf(signers[3].address)).to.equal("1000")
    const foodntf = await foodnft.connect(signers[0]).mint_batch(3, buy.address);
    await foodntf.wait();
    expect(await foodnft.balanceOf(buy.address)).to.equal(3);
    await buy.connect(signers[0]).set_price(0, "100");
    await buy.connect(signers[0]).set_price(1, "100");
    await buy.connect(signers[0]).set_price(2, "100");
    await foodnft.connect(signers[0]).set_power(0, ethers.utils.parseEther("5"));
    await foodnft.connect(signers[0]).set_power(1, ethers.utils.parseEther("2"));
    await foodnft.connect(signers[0]).set_power(2, ethers.utils.parseEther("5"));
    expect(await buy.prices(0)).to.equal("100");
    expect(await buy.prices(1)).to.equal("100");
    expect(await buy.prices(2)).to.equal("100");
    expect(await foodnft.powers(0)).to.equal(ethers.utils.parseEther("5"));
    expect(await foodnft.powers(1)).to.equal(ethers.utils.parseEther("2"));
    expect(await foodnft.powers(2)).to.equal(ethers.utils.parseEther("5"));
    await fakeusdt.connect(signers[1]).approve(buy.address, "1000");
    await fakeusdt.connect(signers[2]).approve(buy.address, "1000");
    await fakeusdt.connect(signers[3]).approve(buy.address, "1000");
    await buy.connect(signers[1]).buy(0);
    await buy.connect(signers[2]).buy(1);
    await buy.connect(signers[3]).buy(2);
    expect(await foodnft.balanceOf(buy.address)).to.equal(0);
    await foodnft.connect(signers[0]).set_whitelist(farm.address, true);
    await farm.connect(signers[1]).stake(0, signers[1].address);
    await farm.connect(signers[2]).stake(1, signers[1].address);
    await farm.connect(signers[3]).stake(2, signers[1].address);
    expect(await foodnft.balanceOf(signers[1].address)).to.equal(0);
    expect(await foodnft.balanceOf(signers[2].address)).to.equal(0);
    expect(await foodnft.balanceOf(signers[3].address)).to.equal(0);
    expect(await foodnft.balanceOf(farm.address)).to.equal(3);
    expect(await farm.__balances(signers[1].address)).to.equal(ethers.utils.parseEther("12"));
    expect(await farm._balances(signers[1].address)).to.equal(ethers.utils.parseEther("24"));
  })
  it("测试挖矿，用3号用户去买已经买过的nft，报错", async function () {
    const CAT = await ethers.getContractFactory("CAT");
    const FOODNFT = await ethers.getContractFactory("FOODNFT");
    const FarmPower = await ethers.getContractFactory("FarmPower");
    const Farm = await ethers.getContractFactory("Farm");
    const Buy = await ethers.getContractFactory("Buy");
    const FUSDT = await ethers.getContractFactory("FUSDT");
    const cat = await CAT.deploy();
    await cat.deployed();
    const foodnft = await FOODNFT.deploy();
    await foodnft.deployed();
    const farmpower = await FarmPower.deploy();
    await farmpower.deployed();
    const farm = await Farm.deploy(foodnft.address, cat.address, farmpower.address);
    await farm.deployed();
    const fakeusdt = await FUSDT.deploy();
    await fakeusdt.deployed();
    const buy = await Buy.deploy(fakeusdt.address, foodnft.address);
    await buy.deployed();
    console.log(`CAT address: ${cat.address}`);
    console.log(`FOODNFT address: ${foodnft.address}`);
    console.log(`FarmPower address: ${farmpower.address}`);
    console.log(`Farm address: ${farm.address}`);
    console.log(`Buy address: ${buy.address}`);
    console.log(`FakeUSDT address: ${fakeusdt.address}`);
    const signers = await ethers.getSigners();
    await cat.connect(signers[0]).mint(farm.address, ethers.utils.parseEther("10000"));
    expect(await cat.totalSupply()).to.equal(ethers.utils.parseEther("10000"));
    expect(await cat.balanceOf(farm.address)).to.equal(ethers.utils.parseEther("10000"));
    const tx1 = await fakeusdt.connect(signers[0]).mint(signers[1].address, '1000');
    const tx2 = await fakeusdt.connect(signers[0]).mint(signers[2].address, '1000');
    const tx3 = await fakeusdt.connect(signers[0]).mint(signers[3].address, '1000');
    await tx1.wait();
    await tx2.wait();
    await tx3.wait();
    expect(await fakeusdt.balanceOf(signers[1].address)).to.equal("1000")
    expect(await fakeusdt.balanceOf(signers[2].address)).to.equal("1000")
    expect(await fakeusdt.balanceOf(signers[3].address)).to.equal("1000")
    const foodntf = await foodnft.connect(signers[0]).mint_batch(3, buy.address);
    await foodntf.wait();
    expect(await foodnft.balanceOf(buy.address)).to.equal(3);
    await buy.connect(signers[0]).set_price(0, "100");
    await buy.connect(signers[0]).set_price(1, "100");
    await buy.connect(signers[0]).set_price(2, "100");
    await foodnft.connect(signers[0]).set_power(0, ethers.utils.parseEther("5"));
    await foodnft.connect(signers[0]).set_power(1, ethers.utils.parseEther("2"));
    await foodnft.connect(signers[0]).set_power(2, ethers.utils.parseEther("5"));
    expect(await buy.prices(0)).to.equal("100");
    expect(await buy.prices(1)).to.equal("100");
    expect(await buy.prices(2)).to.equal("100");
    expect(await foodnft.powers(0)).to.equal(ethers.utils.parseEther("5"));
    expect(await foodnft.powers(1)).to.equal(ethers.utils.parseEther("2"));
    expect(await foodnft.powers(2)).to.equal(ethers.utils.parseEther("5"));
    await fakeusdt.connect(signers[1]).approve(buy.address, "1000");
    await fakeusdt.connect(signers[2]).approve(buy.address, "1000");
    await fakeusdt.connect(signers[3]).approve(buy.address, "1000");
    await buy.connect(signers[1]).buy(0);
    await buy.connect(signers[2]).buy(1);
    try {
      await buy.connect(signers[3]).buy(1);
      throw "1号已经被别人买走了";
    } catch {
      console.log("1号已经被别人买走了");
    }
  })

  
});