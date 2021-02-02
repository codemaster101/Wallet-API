Wallet API

Important notes:
For security, all seeds, private keys and public keys are assumed to be in Buffer format. But for ease of testing the developer will be able to provide the seeds and keys as a string. However, this is not recommended!

How to use:
If you want any configurations to be done for the server, please edit the example.env file:

`NODE_ENV` For which environment you want to run in: development | production.
`CHILD_PROCESS_NUMS` For how many worker threads you want to run for the service.
`API_PORT` The port on which the server should run.
`API_HOST` The host endpoint on which the server should run.

To start the server please run:

./start.sh