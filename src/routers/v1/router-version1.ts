import express, { Router } from 'express';
import serviceAddress from '../../services/service-address';

// Create instance of RouterV1
const RouterV1: express.Router = express.Router();

/**
  * @swagger
  * /api/v1/health:
  *   get:
  *     summary: Check if the server is running smoothly
  *     responses:
  *       '200':
  *         description: OK
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 health:
  *                   type: string
  *                   description: Returns OK if the server is running smoothly.
  */
RouterV1.get('/health', (req, res) => {
  res.send(serviceAddress.healthCheck(req, res));
});

/**
  * @swagger
  * /api/v1/segwit:
  *   post:
  *     summary: Create a segwit address from a given HD path and a seed
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               seed:
  *                 type: string
  *               hdPath:
  *                 type: string
  *     responses:
  *       '200':
  *         description: OK
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 address:
  *                   type: string
  *                   description: Returns a segwit address as a string.
  */
RouterV1.post('/segwit', (req, res) => {
  res.send(serviceAddress.generateSegwitAddress(req, res));
});

/**
  * @swagger
  * /api/v1/multisig:
  *   post:
  *     summary: Create a m-out-of-n multisig address given conditions m, n and public keys
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               m:
  *                 type: number
  *               n:
  *                 type: number
  *               publicKeys:
  *                 type: string
  *                 description: Public Keys should be separated by a comma.
  *     responses:
  *       '200':
  *         description: OK
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 address:
  *                   type: string
  *                   description: Returns a multisig address as a string.
  */
RouterV1.post('/multisig', (req, res) => {
  res.send(serviceAddress.generateMultiSigAddress(req, res));
});

export default RouterV1;
