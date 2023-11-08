# Demo app for Hackerthon Ethereum Starter

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Before starting the development server, please follow these steps:

### 1. Local Ethereum Blockchain Setup

Install and run [Ganache](https://www.trufflesuite.com/ganache) to set up a local Ethereum blockchain for development. This will allow you to deploy smart contracts, develop applications, and run tests.

Default rpc port: 8545
Default chain ID: 31337

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

### 3. Configure Private Key and Contract Address
Update the `src/pages/api/issueVC.ts` file with:
- contract address
- private key which is used to interact with the contract

### 4. Start the Development Server
```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying pages/index.tsx. The page auto-updates as you edit the file.

API routes can be accessed on http://localhost:3000/api/issueVC. This endpoint can be edited in pages/api/issueVC.ts.


Explanation of roles in the app:
- VC owner: the identity that holds the VC / whom the VC is issued to
- Attesting ETH address: the identity whose information is attested and proven as VC
- VC issuer: the identity that issued a VC, hardcoded in the app

Please note the identity aggregation process, that is, the proving process of VC owner actually owning the attesting ETH address is intentionally omitted as it's out of this demo's scope. We'd like to focus on the VC use case and integration.

Please refer to https://github.com/litentry/litentry-parachain for more information if interested.
