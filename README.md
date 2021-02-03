# **Wallet API**

### Important notes:
For security, all seeds, private keys and public keys are assumed to be in Buffer format. But for ease of testing the developer will be able to provide the seeds and keys as a string. However, this is not recommended!

This documentation assumes that you have a working version of Nodejs (built and tested on Node 10) and NPM (6.4.1). 

### How to use:
If you want any configurations to be done for the server, please edit the example.env file:

`NODE_ENV` For which environment you want to run in: development | production.

`CHILD_PROCESS_NUMS` For how many worker threads you want to run for the service.

`API_PORT` The port on which the server should run.

`API_HOST` The host endpoint on which the server should run.

To install node modules, create environment file, build and start the server please run:

**`./start.sh`**

Else, run:

**`npm start`**

### General notes:
1. A **swagger file** (*./swagger/swagger.json*) is provided, please use that as an **API reference**.
2. This API is built on REST.
3. Public Keys are expected to be compressed. Support for providing uncompressed public keys can be added on request.
 
### API Quick Reference
#### Examples
**Health Check of the Server**\
localhost:3000/api/v1/health

**Segwit Address Generator**\
localhost:3000/api/v1/segwit\
Request Body: *seed, hdPath*\
Seed: Seed to be used to reconstruct the segwit address.\
hdPath: Hierarchical Deterministic path for Bitcoin.

**Multisig Address Generator**\
localhost:3000/api/v1/multisig\
Request Body: *m, n, publicKeys*\
m: number of signatures required for the multisig address.\
n: number of public keys from which the address will be constructed from. (m < n)\
publicKeys: n Compressed Public Keys separated by a comma (***,***).\
