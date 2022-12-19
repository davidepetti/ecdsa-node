const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

const balances = {
  d23092f2100c29a16bb228ff7fb21d3414b941ee: 100,
  d232a887f3cd7893845078c17b2fabcddffea706: 50,
  '9f88a4a29ac7ee58f1e4f7805da7809ec37496dc': 75,
};

app.use(cors());
app.use(express.json());

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: 'Not enough funds!' });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
