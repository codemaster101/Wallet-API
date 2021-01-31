/* eslint-disable no-console */
import cluster from 'cluster';
import express, { Express } from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import RouterApi from './routers/router-api';

dotenv.config();

// Checking if all the necessary environment variables exist.
if (typeof process.env.NODE_ENV === 'undefined'
  || typeof process.env.CHILD_PROCESS_NUMS === 'undefined'
  || typeof process.env.API_PORT === 'undefined'
  || typeof process.env.API_HOST === 'undefined') {
  throw new Error('Pre deployment checks failed. Please verify if your environment file is correct.');
}

if (cluster.isMaster) {
  // Configuration
  console.log(`Master ${process.pid} is running`);
  console.log(`Node running mode: ${process.env.NODE_ENV}`);
  console.log(`Node running in: ${process.env.CHILD_PROCESS_NUMS} child process`);
  // @ts-ignore
  const coreNumber = parseInt(process.env.CHILD_PROCESS_NUMS, 10);
  // Fork workers.

  for (let i = 0; i < coreNumber; i += 1) {
    cluster.fork();
  }
  cluster.on('exit', (worker: any, code: number, signal: number) => {
    console.log(`Worker ${worker.process.pid} died with code ${code}, received ${signal}`);
  });
} else {
  console.log(`Child worker PID: ${process.pid} started`);

  // Load singleton express
  const app: Express = express();
  // @ts-ignore
  app.use(bodyParser.urlencoded({ extended: true }));
  // @ts-ignore
  app.use(bodyParser.json());

  app.use('/api', RouterApi);

  // @ts-ignore
  app.listen(process.env.API_PORT, process.env.API_HOST);
}
