/*
    Script to generate the signature of a transaction.
*/

const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

const args = process.argv.slice(2);
if (args.length !== 3) {
  console.log(
    'usage: node generateSignature.js sender_private_key recipient_address send_amount'
  );
  process.exit(1);
}

const privateKey = args[0];
const publickKey = secp.getPublicKey(privateKey);
const key = publickKey.slice(1);
const hash = keccak256(key);
const address = toHex(hash.slice(hash.length - 20));

// construct the transaction object incrementing the sender transaction count with 1
