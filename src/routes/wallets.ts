import { Router, Request, Response } from 'express';
import { AllowedSchema, Validator } from 'express-json-validator-middleware';
import wallet from '../schemas/wallet.json';
import transaction from '../schemas/transaction.json';
import create_player_wallet from '../schemas/create_player_wallet.json';
import controllers from '../controllers';

const { walletsController } = controllers;


const router = Router();
const { validate } = new Validator({});


/**
 * @openapi
 * /wallets:
*   get:
*     summary: Get wallets
*     tags:
 *      - wallets 
 *     responses:
 *       200:
 *         description: Returns wallets.
 */
router.get('/', validate({ query: <AllowedSchema>wallet }), walletsController.getWallets);


/**
 * @openapi
 * /wallets:
 *   post:
*      summary: Create a new wallet
*      tags:
*       - wallets
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*               type: object
*               properties:
*                   walletId:
*                       type: string
*                   openingBalance:
*                       type: number
*                   currencyCode:
*                       type: string
*                       enum:
*                            - EUR
*                            - GBP
*                            - CHF
*                   playerId:
*                        type: string
*            example:
*              walletId: "005"
*              openingBalance: 100
*              currencyCode: "EUR"
*              playerId: "000013"
*      responses:
*        201:
*          description: Created
 */
router.post('/', validate({ body: <AllowedSchema>create_player_wallet }), walletsController.createWallet);


/**
 * @openapi
 * /wallets/{id}:
 *   get:
 *     tags:
 *      - wallets
 *     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            example: "001"
*     summary: Get a single wallet 
 *     responses:
 *       200:
 *          description: Returns info about a wallet
 */
router.get('/:id', validate({ query: <AllowedSchema>wallet }), walletsController.getSingleWallet);


/**
 * @openapi
 * /wallets/{id}/transactions:
 *   get:
 *     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            example: "001"
 *     tags:
 *      - wallets
 *     summary: Get wallet transactions 
 *     responses:
 *       200:
 *         description: Returns wallet transactions
 */
router.get('/:id/transactions', validate({ query: <AllowedSchema>transaction }), walletsController.getWalletTransactions);

export default router;
