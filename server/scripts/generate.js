/*
    Script to generate random pairs of private and public keys.
    From the public keys it generates the addresses in the Ethereum format.
    After that we can put these in the balances mapping.
*/

const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

const privateKey = secp.utils.randomPrivateKey();
console.log('private key:', toHex(privateKey));

const publickKey = secp.getPublicKey(privateKey);
console.log('public key:', toHex(publickKey));

const key = publickKey.slice(1);
const hash = keccak256(key);
const address = toHex(hash.slice(-20));
console.log('address:', address);
