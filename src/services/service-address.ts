/* eslint-disable class-methods-use-this */
// import BigNumber from 'bignumber.js';
import HDKey from 'hdkey';
import * as bitcoin from 'bitcoinjs-lib';
import * as core from 'express-serve-static-core';

class Service {
  public healthCheck(_req: core.Request, res: core.Response): core.Response {
    return res.status(200).json({
      health: 'OK',
    });
  }

  public generateSegwitAddress(req: core.Request, res: core.Response) {
    const { seed, hdPath }: { seed: string | Buffer | Uint8Array, hdPath: string } = req.body;
    let bufMasterSeed: Buffer | undefined;

    const bip: number = parseInt(((hdPath.replace(/'/g, '')).split('/'))[1], 10);

    if (bip < 49) {
      throw new Error('HD path does not allow for a segwit address');
    }

    // In case of future gRPC support for safer storage of seeds in Buffers
    if (Buffer.isBuffer(seed)) {
      bufMasterSeed = seed;
    }

    if (typeof seed === 'string') {
      bufMasterSeed = Buffer.from(seed, 'hex');
    }

    if (Buffer.isBuffer(bufMasterSeed)) {
      const hdKey = HDKey.fromMasterSeed(bufMasterSeed);
      const { publicKey }: { publicKey: Buffer} = hdKey.derive(hdPath);

      const { address }: { address?: string | undefined } = bitcoin.payments.p2wpkh({
        pubkey: publicKey,
      });

      return res.send(200).json({
        address,
      });
    }
    throw new Error('Unable to generate a segwit address with the given parameters.');
  }

  public async generateMultiSigAddress(req: core.Request, res: core.Response) {
    const {
      m, n, addresses,
    }: { m: number, n: number, addresses: string } = req.body;

    const publicKeys = addresses.split(',');

    if (n !== publicKeys.length) {
      throw new Error('Value mismatch. The value of \'n\' does not match the number of public keys provided.');
    }

    const bufPublicKeys = publicKeys.map((hexPubKey) => Buffer.from(hexPubKey, 'hex'));

    const { address } = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2ms({
        m, pubkeys: bufPublicKeys,
      }),
    });

    return res.send(200).json({
      address,
    });
  }
}

export default new Service();
