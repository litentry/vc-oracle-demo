# Demo app for Hackerthon Ethereum Starter

This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Before starting the development server, please follow these steps:

### 1. Local Ethereum Blockchain Setup

Install and run [Ganache](https://www.trufflesuite.com/ganache) to set up a local Ethereum blockchain for development.
This will allow you to deploy smart contracts, develop applications, and run tests.

Use:
Default rpc port: 8545
Default chain ID: 31337

As shown below:

<img width="831" alt="Screenshot 2023-11-15 at 10 08 26" src="https://github.com/cryptoade1/vc-oracle-demo/assets/88367184/867ac24b-b355-452d-89ab-7d04805333f0">


### 2. Deploy Smart Contracts with Hardhat
Firstly you want to create an empty javascript project.

![image (7)](https://github.com/cryptoade1/vc-oracle-demo/assets/88367184/30a2cddb-7401-42d0-8a6b-db297ca777a0)

Then install [Hardhat](https://hardhat.org/) and have it set up in your project.

![image (8)](https://github.com/cryptoade1/vc-oracle-demo/assets/88367184/a761da45-b44a-4ed7-aef1-ff693269c6c4)

Then run the command to call hardhat;

![image (9)](https://github.com/cryptoade1/vc-oracle-demo/assets/88367184/c98d8ec3-261f-4d01-997a-837b72d2c358)

After this, deploy the smart contracts located in the `contracts` directory. 
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

- Config with your Hardhat connect to Ganache

![image (10)](https://github.com/cryptoade1/vc-oracle-demo/assets/88367184/7a40c0a4-3c03-4b96-bdeb-340b042a79b3)

Next, deploy it:

  ```bash
    npx hardhat run scripts/deploy.js --network localhost
  ```
Here's how Hardhard outputs the contract address

![image (11)](https://github.com/cryptoade1/vc-oracle-demo/assets/88367184/8ca3c43b-0001-4a22-9330-ff5e7b0d9380)

### 3. Configure Private Key and Contract Address

Copy the `.env.example` file and fill in your own config:

- NEXT_PUBLIC_ETHEREUM_JSON_RPC your local ganache rpc url
- NEXT_PUBLIC_ETHEREUM_ISSUER_PRIVATE_KEY your private key
- NEXT_PUBLIC_ETHEREUM_CONTRACT_ADDRESS your contract address

### 4. (optional) import an account into your browser wallet(e.g. Metamask)

### 5. Start the Development Server
```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

![image (12)](https://github.com/cryptoade1/vc-oracle-demo/assets/88367184/d52dbdaa-6860-414f-9468-14a0aebabcca)


You can start editing the page by modifying pages/index.tsx. The page auto-updates as you edit the file.

API routes can be accessed on http://localhost:3000/api/issueVC. This endpoint can be edited in pages/api/issueVC.ts.

You can verify the generated VC by copying the VC result and clicking the "How does anyone verify the VC button."
Then paste the VC result in the dialogue box and hit the validate VC button as shown below:

![image (13)](https://github.com/cryptoade1/vc-oracle-demo/assets/88367184/ff5eb53d-8f09-4a76-9e50-2d043c2b9ba7)

Explanation of roles in the app:

- VC owner: the identity that holds the VC / to whom the VC is issued to
- Attesting ETH address: the identity whose information is attested and proven as VC
- VC issuer: the identity that issued a VC, hard coded in the app

Please note the identity aggregation process, that is, the proving process of VC owner actually owning the attesting ETH
address is intentionally omitted as it's out of this demo's scope. We'd like to focus on the VC use case and
integration.

### **Focus of the Hackathon:**

VC use case discovery and integration into your dApp (that shows VC Use case)

### Non-focus:

VC generation and privacy handling throughout the whole generation process

### What we provide:

1. an open-sourced web service, which accepts the user’s VC request, and returns a w3c-compatible VC JSON.
2. an open-sourced SDK that verifies the VC generated in 1.

### Hackers are free to:

- Populate/self-create the VC content, but it should be **on-chain  and/or web2** identity-related information
- Find the VC use case in your dApp (what are you going to do with the VCs?)
- Extend the web service to diversify the ways to integrate the VC into your dApps.

Example: instead of returning the VC as bytes to the user, you can:
    - upload the VC bytes as SBT
    - trigger smart contract using the VC content
    - integrate the VC into wallets and manage/use VCs from there

**TODO:**

Must haves: 

- VC content must be related to your on-chain and/or web2 identities (so nothing about your driving license for instance)
- the vc request must be triggered by the user or user-delegated service
- VC integration and use-case elaboration

Nice-to-haves:

- The data in the VC is LIVE retrieved instead of statically populated
- Highlight the privacy and/or user control during the VC integration
- The dApp of VC use-case has a working prototype

Please refer to https://github.com/litentry/litentry-parachain for more information if interested.
