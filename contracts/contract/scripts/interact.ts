import { ethers } from "hardhat";

// ? This script interacts with the deployed RzNull contract to mint tokens and transfer them to a recipient.
async function main() {
    const CONTRACT_ADDRESS = process.env.DEPLOYED_CONTRACT_ADDRESS;
    const [deployer] = await ethers.getSigners();
    const recipient = "0xC256AB36a48B35159B476e4E2b99984e5A377F81"; // Replace with actual recipient address
    console.log(`Deployer address: ${deployer.address}`);
    console.log(`Recipient address: ${recipient}`);

    if (!recipient || !CONTRACT_ADDRESS) {
        console.error("Recipient address or Contract address is not set. Please provide a valid recipient address.");
        return;
    }

    const Token = await ethers.getContractAt("RzNull", CONTRACT_ADDRESS, deployer);

    // Check balance of deployer
    const deployerBalance = await Token.balanceOf(deployer.address);
    console.log(`Deployer balance: ${ethers.formatUnits(deployerBalance, 18)} tokens`);

    // Mint tokens to deployer
    const mintAmount = ethers.parseUnits("1000", 18); // ? 1000 tokens
    const mintTx = await Token.mint(deployer.address, mintAmount);
    await mintTx.wait();
    console.log(`Minted 1000 tokens to deployer.`);

    // Transfer tokens to recipient
    const transferAmount = ethers.parseUnits("100", 18);
    const transferTx = await Token.transfer(recipient, transferAmount);
    await transferTx.wait(1, 30000); // Wait for 1 block confirmation with a timeout of 30s
    console.log(`Transferred 100 tokens to recipient (${recipient})`);

    // Check balance of recipient
    const recipientBalance = await Token.balanceOf(recipient);
    console.log(`Recipient balance: ${ethers.formatUnits(recipientBalance, 18)} tokens`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
