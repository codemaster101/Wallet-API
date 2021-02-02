import HDKey from 'hdkey';
import * as bitcoin from 'bitcoinjs-lib';
import * as core from 'express-serve-static-core';

class Service {
  private coinTypeId: number;

  constructor() {
    this.coinTypeId = 0;
  }

  public healthCheck(_req: core.Request, res: core.Response): core.Response {
    return res.status(200).json({
      health: 'OK',
    });
  }

  public generateSegwitAddress(req: core.Request, res: core.Response) {
    const { seed, hdPath }: { seed: string | Buffer | Uint8Array, hdPath: string } = req.body;
    let bufMasterSeed: Buffer | undefined;

    const destructuredPath: Array<string> = ((hdPath.replace(/'/g, '')).split('/'));
    const bip: number = parseInt(destructuredPath[1], 10);
    const coinTypeId: number = parseInt(destructuredPath[2], 10);
    if (bip < 49 || coinTypeId !== this.coinTypeId) {
      const err: string = 'HD path does not allow for a segwit bitcoin address';
      console.log(err);
      return res.status(400).json({
        error: err,
      });
    }

    // In case of future gRPC support for safer storage of seeds in Buffers
    if (Buffer.isBuffer(seed)) {
      bufMasterSeed = seed;
    }

    if (typeof seed === 'string') {
      bufMasterSeed = Buffer.from(seed, 'hex');
    }

    if (Buffer.isBuffer(bufMasterSeed)) {
      try {
        const hdKey = HDKey.fromMasterSeed(bufMasterSeed);
        const { publicKey }: { publicKey: Buffer} = hdKey.derive(hdPath);

        const { address }: { address?: string | undefined } = bitcoin.payments.p2wpkh({
          pubkey: publicKey,
        });

        return res.status(200).json({
          address,
        });
      } catch (err) {
        console.error(err);
        return res.status(400).json({
          error: err.message,
        });
      }
    }
    throw new Error('Unable to generate a segwit address with the given parameters.');
  }

  public async generateMultiSigAddress(req: core.Request, res: core.Response) {
    const {
      m, n, publicKeys,
    }: { m: number, n: number, publicKeys: string } = req.body;

    const publicKeysArray = publicKeys.split(',');

    if (n !== publicKeysArray.length) {
      throw new Error('Value mismatch. The value of \'n\' does not match the number of public keys provided.');
    }

    try {
      const bufPublicKeys = publicKeysArray.map((hexPubKey) => Buffer.from(hexPubKey, 'hex'));

      const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({
          m, pubkeys: bufPublicKeys,
        }),
      });

      return res.status(200).json({
        address,
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        error: err.message,
      });
    }
  }
}

export default new Service();
