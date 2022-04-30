const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TimeLock", function () {
  it("Should release token base user vest after locktime", async function () {
    const CAT = await ethers.getContractFactory("CAT");
    const cat = await CAT.deploy();
    await cat.deployed();

    const signers = await ethers.getSigners();
    const TimeLock = await ethers.getContractFactory("TimeLock");
    const timeLock = await TimeLock.deploy(cat.address, signers[0].address);
    await timeLock.deployed();

    await cat.connect(signers[0]).mint(signers[0].address, 1000);
    expect(await cat.balanceOf(signers[0].address)).to.equal(1000);
  
    cat.connect(signers[0]).approve(timeLock.address, 1000);
  
    timeLock.connect(signers[0]).vest(signers[1].address, 730);


    try {
      await timeLock.connect(signers[0]).setCurrentTime(365 - 1);
      await timeLock.connect(signers[1]).release();
    }
    catch {
      console.log("not to release time, still locked");
      expect(await cat.balanceOf(signers[1].address)).to.equal(0);
      expect(await cat.balanceOf(signers[0].address)).to.equal(1000);
    }

    await timeLock.connect(signers[0]).setCurrentTime(365 + 1);
    await timeLock.connect(signers[1]).release();
    expect(await cat.balanceOf(signers[1].address)).to.equal(1);
    expect(await cat.balanceOf(signers[0].address)).to.equal(999);


    await timeLock.connect(signers[0]).setCurrentTime(365 * 3);
    await timeLock.connect(signers[1]).release();
    expect(await cat.balanceOf(signers[1].address)).to.equal(730);
    expect(await cat.balanceOf(signers[0].address)).to.equal(270);

    try {
      await timeLock.connect(signers[0]).setCurrentTime(365 * 3 + 1);
      await timeLock.connect(signers[1]).release();   
    }
    catch {
      console.log("all your token has released");
      expect(await cat.balanceOf(signers[1].address)).to.equal(730);
      expect(await cat.balanceOf(signers[0].address)).to.equal(270);
    }
  });
});
