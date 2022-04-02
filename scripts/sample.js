const hre = require("hardhat");
async function main() {

const CAT = await hre.ethers.getContractFactory("CAT");
const cat = await CAT.deploy();
await cat.deployed();
const FOODNFT = await hre.ethers.getContractFactory("FOODNFT");
const foodnft = await FOODNFT.deploy();
await foodnft.deployed();
const FUSDT = await hre.ethers.getContractFactory("FUSDT");
const fusdt = await FUSDT.deploy();
await fusdt.deployed();
const Buy = await hre.ethers.getContractFactory("Buy");
const buy = await Buy.deploy(fusdt.address, foodnft.address);
await buy.deployed();
const FarmPower = await ethers.getContractFactory("FarmPower");
const farmpower = await FarmPower.deploy();
await farmpower.deployed();
const Farm = await ethers.getContractFactory("Farm");
const farm = await Farm.deploy(foodnft.address, cat.address, farmpower.address);
await farm.deployed();
console.log("CAT contract address:", cat.address);
console.log("FOODNFt contract address:", foodnft.address);
console.log("FUSDT contract address:", fusdt.address);
console.log("Buy contract address:", buy.address);
console.log("FarmPower contract address:", farmpower.address);
console.log("Farm contract address:", farm.address);


const signer = await ethers.getSigner();
const signers = await ethers.getSigners();
console.log("signer address:", signer.address);
console.log("signers[0] address:", signers[0].address);

{
  console.log(`CAT total balance: ${ethers.utils.formatEther(await cat.totalSupply())}`);
  const tx = await cat.connect(signer).mint(signers[1].address, ethers.utils.parseEther("100"));
  const tx2 = await cat.connect(signer).mint(signers[2].address, ethers.utils.parseEther("100"));
  await tx.wait();
  await tx2.wait();
  console.log(`tx: ${tx.hash}`);
  console.log(`CAT balance: ${ethers.utils.formatEther(await cat.totalSupply())}`);
  console.log(`CAT balance: ${ethers.utils.formatEther(await cat.balanceOf(signers[1].address))}`);
}



}




main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
