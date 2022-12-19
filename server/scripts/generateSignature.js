/*
    Script to generate the signature of a transaction.
*/

const secp = require('ethereum-cryptography/secp256k1');
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

const txCount = {
  '0x1': 0,
  '0x2': 0,
  '0x3': 0,
};

async function generateSignature() {
  const args = process.argv.slice(2);
  if (args.length !== 3) {
    console.log(
      'usage: node generateSignature.js sender_private_key recipient_address send_amount'
    );
    process.exit(1);
  }

  const privateKey = args[0].trim();
  const publickKey = secp.getPublicKey(privateKey);
  const key = publickKey.slice(1);
  const hash = keccak256(key);
  const address = toHex(hash.slice(-20));
  txCount[address]++;

  // construct the transaction object incrementing the sender transaction count with 1
  const tx = {
    sender: address,
    recipient: args[1].trim(),
    amount: parseInt(args[2].trim()),
    nonce: txCount[address],
  };

  const txHash = keccak256(utf8ToBytes(JSON.stringify(tx)));
  console.log('txHash:', toHex(txHash));
  const signature = await secp.sign(txHash, privateKey, { recovered: true });
  console.log('signature:', toHex(signature[0]));
  console.log('recovery bit:', signature[1]);
}

generateSignature();
