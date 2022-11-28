const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');

const privateKey = secp.utils.randomPrivateKey();

console.log('private key:', toHex(privateKey));

const publickKey = secp.getPublicKey();
console.log('public key:', toHex(publickKey));
