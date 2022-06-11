const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TimeLock", function () {
  it("Should release token after locktime", async function () {
    const CAT = await ethers.getContractFactory("CAT");
    const cat = await CAT.deploy();
    await cat.deployed();

    const signers = await ethers.getSigners();
    const TimeLock = await ethers.getContractFactory("TimeLock");
    const dt = Date.now();
    const ts = Math.floor(dt / 1000);

    const timeLock = await TimeLock.deploy(signers[1].address, ts + 600, 100);
    await timeLock.deployed();

    await cat.connect(signers[0]).mint(timeLock.address, 100);
    expect(await cat.balanceOf(timeLock.address)).to.equal(100);

    await hre.network.provider.send("evm_setAutomine", [false]);

    console.log("token in lock time");
    await hre.network.provider.send("evm_setNextBlockTimestamp", [ts + 300]);
    await hre.network.provider.send("evm_mine");
    await timeLock.connect(signers[1])["release(address)"](cat.address);
    released = await timeLock.connect(signers[1])["released(address)"](cat.address);
    expect(released).to.equal(0);
    expect(await cat.balanceOf(signers[1].address)).to.equal(0);
    expect(await cat.balanceOf(timeLock.address)).to.equal(100);

    console.log("token in relese time release 80");
    await hre.network.provider.send("evm_setNextBlockTimestamp", [ts + 600 + 80]);
    await hre.network.provider.send("evm_mine");
    await timeLock.connect(signers[1])["release(address)"](cat.address);
    released = await timeLock.connect(signers[1])["released(address)"](cat.address);
    expect(released).to.equal(80);
    expect(await cat.balanceOf(signers[1].address)).to.equal(80);
    expect(await cat.balanceOf(timeLock.address)).to.equal(20);

    console.log("token in relese time release 100");
    await hre.network.provider.send("evm_setNextBlockTimestamp", [ts + 600 + 100]);
    await hre.network.provider.send("evm_mine");
    await timeLock.connect(signers[1])["release(address)"](cat.address);
    released = await timeLock.connect(signers[1])["released(address)"](cat.address);
    expect(released).to.equal(100);
    expect(await cat.balanceOf(signers[1].address)).to.equal(100);
    expect(await cat.balanceOf(timeLock.address)).to.equal(0);

    console.log("token after relese time all token released")
    await hre.network.provider.send("evm_setNextBlockTimestamp", [ts + 600 + 100 + 200]);
    await hre.network.provider.send("evm_mine");
    await timeLock.connect(signers[1])["release(address)"](cat.address);
    released = await timeLock.connect(signers[1])["released(address)"](cat.address);
    expect(released).to.equal(100);
    expect(await cat.balanceOf(signers[1].address)).to.equal(100);
    expect(await cat.balanceOf(timeLock.address)).to.equal(0);
  });
});
