import React, {useState} from 'react';
import {Box, Button, FormControl, FormLabel, Textarea, Code, Center, ChakraProvider} from '@chakra-ui/react';
import {Container, Heading} from "@chakra-ui/layout";
import Logo from "@/components/logo";
import {hexToU8a} from "@polkadot/util";
import {signatureVerify} from "@polkadot/util-crypto";
import Head from "next/head";

const ValidateVcPage: React.FC = () => {
    const [vcInput, setVcInput] = useState<string>('');
    const [validationResult, setValidationResult] = useState<string | null>(null);

    const verifyVc = (vcJson: string) => {
        try {
            const vc = JSON.parse(vcJson);
            // Extracting the public key from the issuer's DID
            const didParts = vc.issuer?.split(":");
            if (!didParts || didParts.length !== 3) {
                return false;
            }
            const publicKey = didParts[2];

            // Remove the 'proof' field and re-serialize the VC JSON
            const {proof, ...restVc} = vc;
            const message = JSON.stringify(restVc);

            // Prepare data for verification
            const signature = hexToU8a(proof?.proofValue);
            const vcPubKey = hexToU8a(publicKey);

            // Verify the signature
            const {isValid} = signatureVerify(message, signature, vcPubKey);

            return isValid;
        } catch (e) {
            console.error(e);
            return false
        }
    };

    const handleValidation = () => {
        try {
            const isValid = verifyVc(vcInput);

            setValidationResult(isValid ? 'The VC is valid.' : 'The VC is not valid.');
        } catch (error) {
            console.error('There was an error validating the VC:', error);
            setValidationResult('There was an error validating the VC.');
        }
    };

    return (
        <ChakraProvider>
            <Head>
                <title>VC validate</title>
                <meta name="description" content="Validate VC"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Container p={5} maxWidth={{base: "100%"}} my={10} p={{base: 4, sm: 10}} height="100vh"
                       marginY={0}
                       marginX={{base: 0}}
                       bg="#18191D">
                <Center>
                    <Logo/>
                </Center>
                <Heading mb={12} fontSize={32} fontWeight={600} textAlign="center" color="#E6E7F0">VC verifier</Heading>
                <FormControl id="vc-input" mb={4}>
                    <FormLabel>Input Verifiable Credential JSON:</FormLabel>
                    <Textarea
                        value={vcInput}
                        onChange={(e) => setVcInput(e.target.value)}
                        placeholder="Paste the VC JSON here"
                        borderColor="#18191D"
                        bg="#2A2D36"
                        fontSize={14}
                        fontWeight={500}
                        color="#E6E7F0"
                    />
                </FormControl>
                <Center>
                    <Button w="194px" fontSize={18} fontWeight="bold" borderRadius="90px" h={57} bg="#3772FF"
                            colorScheme="green" onClick={handleValidation}>
                        Validate VC
                    </Button>
                </Center>

                <Box mt={4}>
                    <FormLabel>Validation Result:</FormLabel>
                    <Center>
                        <Code>
                            {validationResult}
                        </Code>
                    </Center>
                    <br/>
                    <Center>
                        <Code>
                            {validationResult === 'The VC is valid.' && 'Note: Although this Verifiable Credential has passed integrity checks, you must also have sufficient trust in the issuer to rely on the information contained within.'}
                        </Code>
                    </Center>
                    <br/>
                    <Center>
                        <Code>
                            {validationResult === 'The VC is valid.' && 'Business stats here.'}
                        </Code>
                    </Center>
                </Box>
            </Container>
        </ChakraProvider>

    );
};

export default ValidateVcPage;
