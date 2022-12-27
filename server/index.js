const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

const balances = {
  '0x08cbe4ce481d1f37f6dd418e61eb355dc6704093': 100,
  '0x4095c0461da190f20747ed49f191d8a57078cf93': 50,
  '0xd20f193da2d3c1fc726df2d650fe4da3eeb97934': 75,
};

app.use(cors());
app.use(express.json());

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { signature, txHash, recoveryBit, recipient, amount } = req.body;

  const publicKey = secp.recoverPublicKey(
    txHash,
    signature,
    parseInt(recoveryBit)
  );
  const key = publicKey.slice(1);
  const hash = keccak256(key);
  const senderAddress = `0x${toHex(hash.slice(-20))}`;

  setInitialBalance(senderAddress);
  setInitialBalance(recipient);

  if (balances[senderAddress] < amount) {
    res.status(400).send({ message: 'Not enough funds!' });
  } else {
    balances[senderAddress] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[senderAddress] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
