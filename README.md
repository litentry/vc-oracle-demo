# Demo app for Hackerthon Ethereum Starter

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Before starting the development server, please follow these steps:

### 1. Local Ethereum Blockchain Setup

Install and run [Ganache](https://www.trufflesuite.com/ganache) to set up a local Ethereum blockchain for development. This will allow you to deploy smart contracts, develop applications, and run tests.

### 2. Deploy Smart Contracts with Hardhat

Deploy the smart contracts located in the `contracts` directory. Make sure you have [Hardhat](https://hardhat.org/) installed and set up in your project.
put `VC.sol` in the Hardhat `contracts` directory and put this in your `deploy.js`
```javascript
const hre = require("hardhat");
async function main() {
  const VC = await hre.ethers.deployContract("VC");
  await VC.waitForDeployment();
  console.log(
    `VC deployed to ${VC.target}`
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

- Config with your Hardhat connect to Ganache and then deploy it:

  ```bash
    npx hardhat run scripts/deploy.js --network localhost
  ```

### 3. Configure Private Key
Update the `src/pages/api/issueVC.ts` file with your private key obtained from Ganache. Replace the existing private key placeholder with your own to interact with the blockchain.

### 4. Start the Development Server
```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying pages/index.tsx. The page auto-updates as you edit the file.

API routes can be accessed on http://localhost:3000/api/issueVC. This endpoint can be edited in pages/api/issueVC.ts.