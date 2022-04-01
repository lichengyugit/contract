const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Farm", function () {

  it("测试挖矿，先质押一个foodcat算力为5，在质押一个foodcat算力为2，产生的收益是否正常", async function () {
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


    await fakeusdt.connect(signers[1]).approve(buy.address,"1000");
    await fakeusdt.connect(signers[2]).approve(buy.address,"1000");

    await buy.connect(signers[1]).buy(0);
    await buy.connect(signers[2]).buy(1);


    expect(await foodnft.balanceOf(buy.address)).to.equal(0);


    //await foodnft.connect(signers[0]).set_whitelist(farm.address, true);


    //await farm.connect(signers[1]).stake(0, signers[1].address);


  })
});