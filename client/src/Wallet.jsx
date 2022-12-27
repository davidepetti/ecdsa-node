import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';
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
  const setValue = (setter) => (event) => setter(event.target.value);

  async function onClick(event) {
    if (signature && recoveryBit && txHash) {
      const publicKey = secp.recoverPublicKey(
        txHash,
        signature,
        parseInt(recoveryBit)
      );
      const key = publicKey.slice(1);
      const hash = keccak256(key);
      const address = `0x${toHex(hash.slice(-20))}`;
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className='container wallet'>
      <h1>Your Wallet</h1>

      <label>
        Signature
        <input
          placeholder='Enter the signature of the transaction'
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>

      <label>
        Recovery Bit
        <input
          placeholder='Enter the recovery bit of the signature'
          value={recoveryBit}
          onChange={setValue(setRecoveryBit)}
        ></input>
      </label>

      <label>
        Transaction Hash
        <input
          placeholder='Enter the transaction hash'
          value={txHash}
          onChange={setValue(setTxHash)}
        ></input>
      </label>

      <input
        type='button'
        className='button'
        value='Check Balance'
        onClick={onClick}
      />

      <div className='balance'>Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
