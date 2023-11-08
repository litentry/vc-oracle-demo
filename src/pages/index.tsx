import Head from 'next/head'
import {Center, Container, Heading} from "@chakra-ui/layout";
import Logo from "@/components/logo";
import {
    Box,
    Button,
    ChakraProvider,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react';
import React, {useState} from 'react';
import {Keyring} from '@polkadot/keyring';
import {u8aToHex} from "@polkadot/util";
import NextLink from 'next/link'
import {Link} from '@chakra-ui/react'
import 'react18-json-view/src/style.css'
import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import('react18-json-view'), {ssr: false});

const keyring = new Keyring({type: 'sr25519', ss58Format: 2});
const pair = keyring.addFromUri(`isolate bamboo tennis vivid chicken razor onion process relax fever town board`, {name: 'test pair'}, 'ed25519');

export default function Home() {
    const [publicKey, setPublicKey] = useState<string>(u8aToHex(pair.publicKey));
    const [ethAddress, setEthAddress] = useState<string>('0x079E275E78783FD1864401ca0F933b3414c65243');
    const [vcResult, setVcResult] = useState<any>(null);

    const issueVc = async () => {
        try {
            const response = await fetch('/api/issueVC', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    credentialSubjectId: publicKey,
                    ethAddress,
                }),
            });

            const data = await response.json();
            setVcResult(data);
        } catch (error) {
            console.error('There was an error issuing the VC:', error);
            setVcResult({error: 'There was an error issuing the VC'});
        }
    };


    return (
        <ChakraProvider>
            <Head>
                <title>VC oracle</title>
                <meta name="description" content="Generate VC"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Container maxWidth={{base: "100%"}} my={10} p={{base: 4, sm: 10}} height="100vh"
                       marginY={0}
                       marginX={{base: 0}}
                       bg="#18191D">
                <Center>
                    <Logo/>
                </Center>
                <Heading mb={12} fontSize={32} fontWeight={600} textAlign="center" color="#E6E7F0">A demo VC issuer app
                    that
                    proves you hold some ETHs without address revealed</Heading>
                <Center p={5} gap={16} color="#ffffff" flexWrap="wrap" maxWidth={800} marginX="auto">
                    <FormControl id="public-key" mb={4} display="flex" gap={16} justifyContent="start"
                                 alignItems="center" w="100%">
                        <FormLabel whiteSpace="nowrap">Personal pubKey:</FormLabel>
                        <Input
                            w="100%"
                            type="text"
                            value={publicKey}
                            borderColor="#18191D"
                            bg="#2A2D36"
                            size="md"
                            borderRadius="12px"
                            fontSize={14}
                            fontWeight={500}
                            color="#E6E7F0"
                            placeholder="Input a Substrate based address here."
                            onChange={(e) => setPublicKey(e.target.value)}
                        />
                    </FormControl>

                    <FormControl id="degree-field" mb={4} display="flex" gap={16} justifyContent="start"
                                 alignItems="center" w="100%">
                        <FormLabel whiteSpace="nowrap">ETH address:</FormLabel>
                        <Input
                            w="100%"
                            type="text"
                            value={ethAddress}
                            borderColor="#18191D"
                            bg="#2A2D36"
                            size="md"
                            borderRadius="12px"
                            fontSize={14}
                            fontWeight={500}
                            color="#E6E7F0"
                            placeholder="Input a degree field here. e.g. Computer Science"
                            onChange={(e) => setEthAddress(e.target.value)}
                        />
                    </FormControl>

                    <Button w="194px" fontSize={18} fontWeight="bold" borderRadius="90px" h={57} bg="#3772FF"
                            colorScheme="green" onClick={issueVc}>
                        Request VC
                    </Button>

                    <Center>
                        {
                            vcResult && <Link as={NextLink} href='/validate' textDecoration="underline" color="#E6E7F0">
                                How does somebody else validates this?
                            </Link>
                        }
                    </Center>

                    <Box mt={4} display="flex" gap={16} justifyContent="start" w="100%">

                        <FormLabel whiteSpace="nowrap">VC Result:</FormLabel>
                        <ReactJson src={(vcResult)}/>
                    </Box>
                </Center>

            </Container>
        </ChakraProvider>
    )
}
