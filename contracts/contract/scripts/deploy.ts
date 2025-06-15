import { ethers } from "hardhat";

async function main() {
    console.log("Deploying contract...");
    const Token = await ethers.getContractFactory("RzNull");
    const [deployer] = await ethers.getSigners();
    // ? deploy the contract
    const token = await Token.deploy(deployer.address);

    // ? for updating of contract
    // const token = Token.attach(process.env.DEPLOYED_CONTRACT_ADDRESS!);

    console.log("Transaction hash:", token.deploymentTransaction()?.hash);
    console.log("Waiting for confirmation...");
    await token.waitForDeployment();
    console.log(`Token deployed to: ${token.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});