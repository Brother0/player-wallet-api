import { Router, Request, Response } from 'express';

import { AllowedSchema, Validator } from 'express-json-validator-middleware';
import transaction from '../schemas/transaction.json';
import create_wallet_transaction from '../schemas/create_wallet_transaction.json';
import controllers from '../controllers';

const { transactionsController } = controllers;


const router = Router();
const { validate } = new Validator({});

/**
 * @openapi
 * /transactions:
*   get:
*     summary: Get transactions
*     tags:
 *      - transactions  
 *     responses:
 *       200:
 *         description: Returns transactions
 */
router.get('/', validate({ query: <AllowedSchema>transaction }), transactionsController.getTransactions);

/**
 * @openapi
 * /transactions:
 *   post:
 *     summary: Post a transaction.
*     tags:
*          - transactions
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*              type: object
*              properties:
*                   transactionId:
*                       type: string
*                   walletId:
*                       type: string
*                   sessionId:
*                       type: string
*                   amount:
*                       type: number
*                   transactionType:
*                       type: string
*                       enum:
*                            - Bet
*                            - Withdraw
*           example:
*               transactionId: "100"
*               walletId: "001"
*               sessionId: "001"
*               amount: 200
*               transactionType: 
*     responses:
*       201:
*         description: Created
 */
router.post('/', validate({ body: <AllowedSchema>create_wallet_transaction }), transactionsController.createTransaction);

/**
 * @openapi
 * /transactions/{id}:
 *   get:
 *     summary: Get a single transaction.
 *     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            example: "000-001"
 *     tags:
 *      - transactions
 *     responses:
 *       200:
 *         description: Returns detailed single transaction info
 */
router.get('/:id', validate({ query: <AllowedSchema>transaction }), transactionsController.getSingleTransaction);


export default router;
