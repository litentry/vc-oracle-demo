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
        id: string,
        degree: {
            type: string,
            field: string,
            university: string
        }
    },
    proof: {
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

    const {studentID, degreeField} = req.body

    if (!studentID || !degreeField) {
        return res.status(400).json({error: 'Bad Request: Missing required fields'})
    }

    // TBD: logic that checks validity of the request

    // Create the VC payload without the proof
    const payload: Omit<VC, 'proof'> = {
        '@context': 'https://www.w3.org/2018/credentials/v1',
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        issuer: `did:harvard:${u8aToHex(pair.publicKey)}`,
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
            id: `did:studentPubKey:${studentID}`,
            degree: {
                type: 'PhD',
                field: degreeField,
                university: 'Harvard University'
            }
        }
    }

    const signatureU8a = pair.sign(JSON.stringify(payload));
    console.log(JSON.stringify(payload))
    const signature = u8aToHex(signatureU8a)

    const vc: VC = {
        ...payload,
        proof: {
            createdTimestamp: Date.now(),
            proofValue: signature,
            proofPurpose: 'assertionMethod',
        }
    }

    res.status(200).json(vc)
}
