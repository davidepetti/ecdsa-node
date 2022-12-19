import secp, { sign } from 'ethereum-cryptography/secp256k1';
import toHex from 'ethereum-cryptography/utils';
import keccak256 from 'ethereum-cryptography/keccak';
import server from './server';

function Wallet({
  signature,
  setSignature,
  balance,
  setBalance,
  recoveryBit,
  setRecoveryBit,
  txHash,
  setTxHash,
}) {
  async function onChange(event) {
    if (signature && recoveryBit && txHash) {
      const publicKey = await secp.recoverPublicKey(
        txHash,
        signature,
        recoveryBit
      );
      const key = publicKey.slice(1);
      const hash = keccak256(key);
      const address = toHex(hash.slice(-20));
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  function onSignatureChange(event) {
    setSignature(event.target.value);
  }

  function onRecoveryBitChange(event) {
    setRecoveryBit(event.target.value);
  }

  function onTxHashChange(event) {
    setTxHash(event.target.value);
  }

  return (
    <div className='container wallet'>
      <h1>Your Wallet</h1>

      <label>
        Signature
        <input
          placeholder='Enter the signature of the transaction'
          value={signature}
          onChange={(e) => {
            onSignatureChange(e);
            onChange(e);
          }}
        ></input>
      </label>

      <label>
        Recovery Bit
        <input
          placeholder='Enter the recovery bit of the signature'
          value={recoveryBit}
          onChange={(e) => {
            onRecoveryBitChange(e);
            onChange(e);
          }}
        ></input>
      </label>

      <label>
        Transaction Hash
        <input
          placeholder='Enter the transaction hash'
          value={txHash}
          onChange={(e) => {
            onTxHashChange(e);
            onChange(e);
          }}
        ></input>
      </label>

      <div className='balance'>Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
