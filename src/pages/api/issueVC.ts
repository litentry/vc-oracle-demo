import type {NextApiRequest, NextApiResponse} from 'next'
import {Keyring} from '@polkadot/keyring';
import {u8aToHex} from '@polkadot/util';
import {promises as fs} from 'fs';
import {ethers} from "ethers";

const keyring = new Keyring({type: 'sr25519', ss58Format: 2});

type VC = {
    '@context': string,
    type: string[],
    id: number,
    issuer: string,
    issuanceDate: string,
    credentialSubject: {
        id: string
    },
    assertion: {
        ethBalanceThreshold: number,
        op: string,
        dst: boolean,
        timestamp: number,
    }
    proof: {
        type: string,
        proofValue: string,
        proofPurpose: string,
        createdTimestamp: number,
    }
}

const contractABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "VC",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "_properties",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "getVC",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32[]",
                "name": "_propertyList",
                "type": "bytes32[]"
            }
        ],
        "name": "setProperties",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "property",
                "type": "bytes32"
            },
            {
                "internalType": "bytes",
                "name": "content",
                "type": "bytes"
            }
        ],
        "name": "setVCProperty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "property",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "content",
                "type": "string"
            }
        ],
        "name": "setVCPropertyString",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<VC | { error: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method Not Allowed'})
    }
    const nodeUrl = 'http://127.0.0.1:8545';

    // Update the following vars in case a new network is launched from scratch:
    // - contractAddress
    // - privateKey, which is used to interact with the contract. It needs to have some balance
    const contractAddress = '0xD3E32B48F5d463997B402ECEDec4AE958207e9dF';
    const privateKey = '0xc50f3d80fa49d6d5bbf880b01303767ff53bb47140df786d625e57d2e3a79b76';

    const provider = new ethers.JsonRpcProvider(nodeUrl);
    const wallet = new ethers.Wallet(privateKey).connect(provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // the key pair of the VC issuer
    const pair = keyring.addFromUri(`spend mistake potato obey lounge shop region guilt tobacco uphold clump throw`, {name: 'first pair'}, 'ed25519');

    const {credentialSubjectId, ethAddress, threshold, signature} = req.body

    if (!credentialSubjectId || !ethAddress) {
        return res.status(400).json({error: 'Bad Request: Missing required fields'})
    }

    const signatureVerified = ethers.verifyMessage(credentialSubjectId, signature);

    if (!signatureVerified) {
        return res.status(400).json({error: 'Bad Request: Signature verification failed'})
    }

    const id = await getNextUniqueId();

    // Create the VC payload without the proof
    const payload: Omit<VC, 'proof'> = {
        '@context': 'https://www.w3.org/2018/credentials/v1',
        type: ['VerifiableCredential', 'TokenHolderCredential'],
        issuer: `did:litentryDemoApp:${u8aToHex(pair.publicKey)}`,
        id,
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
            id: `did:litentryDemoApp:${credentialSubjectId}`,
        },
        assertion: {
            ethBalanceThreshold: threshold,
            op: '>',
            dst: true,
            timestamp: Date.now(),
        }
    }

    const signatureU8a = pair.sign(JSON.stringify(payload));
    const proofValue = u8aToHex(signatureU8a)
    const tx = await contract.setVCProperty(id, ethers.encodeBytes32String("signature"), ethers.toUtf8Bytes(proofValue));

    const vc: VC = {
        ...payload,
        proof: {
            type: 'Ed25519Signature2018',
            createdTimestamp: Date.now(),
            proofValue,
            proofPurpose: 'assertionMethod',
        }
    }

    res.status(200).json(vc)
}

async function getNextUniqueId(): Promise<number> {
    const filePath = `${process.cwd()}/counter.txt`;
    let counter = parseInt(await fs.readFile(filePath, {encoding: 'utf-8'}), 10);
    counter += 1;
    await fs.writeFile(filePath, counter.toString(), {encoding: 'utf-8'});
    return counter;
}