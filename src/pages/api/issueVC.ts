import type {NextApiRequest, NextApiResponse} from 'next'
import {Keyring} from '@polkadot/keyring';
import {u8aToHex} from '@polkadot/util';
// import {mnemonicGenerate} from '@polkadot/util-crypto';

const keyring = new Keyring({type: 'sr25519', ss58Format: 2});


type VC = {
    '@context': string,
    type: string[],
    issuer: string,
    issuanceDate: string,
    credentialSubject: {
        id: string
    },
    assertion: {
        ethBalance: number,
        timestamp: number,
    }
    proof: {
        type: string,
        proofValue: string,
        proofPurpose: string,
        createdTimestamp: number,
    }
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<VC | { error: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method Not Allowed'})
    }
    // NOTE: This is a test keypair. DO NOT USE IN PRODUCTION
    const pair = keyring.addFromUri(`nerve bacon quarter name cross jaguar original flower invest action acquire betray`, {name: 'first pair'}, 'ed25519');

    const {credentialSubjectId, ethAddress} = req.body

    if (!credentialSubjectId || !ethAddress) {
        return res.status(400).json({error: 'Bad Request: Missing required fields'})
    }

    // TBD: logic that checks validity of the request

    // Create the VC payload without the proof
    const payload: Omit<VC, 'proof'> = {
        '@context': 'https://www.w3.org/2018/credentials/v1',
        type: ['VerifiableCredential', 'TokenHolderCredential'],
        issuer: `did:litentryDemoApp:${u8aToHex(pair.publicKey)}`,
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
            id: `did:eth:${ethAddress}`,
        },
        assertion:{
            ethBalance: 100,
            timestamp: Date.now(),
        }
    }

    const signatureU8a = pair.sign(JSON.stringify(payload));
    console.log(JSON.stringify(payload))
    const signature = u8aToHex(signatureU8a)

    const vc: VC = {
        ...payload,
        proof:{
            type: 'Ed25519Signature2018',
            createdTimestamp: Date.now(),
            proofValue: signature,
            proofPurpose: 'assertionMethod',
        }
    }

    res.status(200).json(vc)
}
