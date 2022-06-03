import { Router } from 'express';
import { AllowedSchema, Validator } from 'express-json-validator-middleware';
import player from '../schemas/players.json';
import transaction from '../schemas/transaction.json';
import wallet from '../schemas/wallet.json';
import create_player_wallet from '../schemas/create_player_wallet.json';
import session from '../schemas/session.json';
import open_player_session from '../schemas/open_player_session.json';
import create_wallet_transaction from '../schemas/create_wallet_transaction.json';
import authorizePlayers from '../middleware/player-authorizer';
import controllers from '../controllers';

const { playersController } = controllers;

const router = Router();
const { validate } = new Validator({});

/**
 * @openapi
 * /players:
 *   get: 
*     summary: List of players in the system.
*     tags:
 *      - players
 *     responses:
 *       200:
 *         description: Returns available players.    
 */
router.get('/', validate({ query: <AllowedSchema>player }), playersController.getPlayers);

/**
 * @openapi
 * /players/{id}:
 *   get:
*     summary: Get a single player.
*     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            example: "000001"
 *     description: Get player with id 
*     tags:
 *      - players 
*     responses:
 *       200:
 *         description: Returns player details
 *       
 */
router.get('/:id', authorizePlayers, validate({ query: <AllowedSchema>player }), playersController.getPlayer);

/**
 * @openapi
 * /players/{id}/wallets:
 *   get:
 *     summary: Get a players wallet.
  *     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            example: "000001"
 *     description: Get player with id 
*     tags:
 *      - players
*     responses:
 *       200:
 *         description: Returns player wallet if it exists. Otherwise returns a link to the address for wallet creation
 */
router.get('/:id/wallets', authorizePlayers, validate({ query: <AllowedSchema>wallet }), playersController.getPlayerWallet);

/**
*  @openapi
*  /players/{id}/wallets:
*    post:
*      summary: Creates a wallet for a user.
*      tags:
*       - players
*      parameters:
*          - in: path
*            name: id
*            required: true
*            example: "000010"
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
*            example:
*              walletId: "005"
*              openingBalance: 100
*              currencyCode: "EUR"
*      responses:
*        201:
*          description: Created
*/
router.post('/:id/wallets', authorizePlayers, validate({ body: <AllowedSchema>create_player_wallet }), playersController.createPlayerWallet);

/**
 * @openapi
 * /players/{id}/sessions:
 *   get:
*     summary: Get players sessions.
*     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Player business number
 *            example: "000001"
 *     description: Get player with id 
*     tags:
 *      - players
*     responses:
 *       200:
 *         description: Returns player sessions
 */
router.get('/:id/sessions', authorizePlayers, validate({ query: <AllowedSchema>session }), playersController.getPlayerSessions);

/**
 * @openapi
 * /players/{id}/sessions:
 *   post:
*      summary: Create a new player session.
*      tags:
*       - players
*      parameters:
*          - in: path
*            name: id
*            required: true
*            example: "000001"
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*               type: object
*               properties:
*                   sessionId:
*                       type: string
*            example:
*               sessionId: "010"
*      responses:
*        201:
*          description: Created
 */
router.post('/:id/sessions', authorizePlayers, validate({ body: <AllowedSchema>open_player_session }), playersController.createPlayerSession);


/**
 * @openapi
 * /players/{id}/transactions:
 *   get:
 *     summary: Get players transactions.
 *     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Player business number
 *            example: "000001"
 *     tags:
 *      - players
 *     responses:
 *       200:
 *         description: Get player transactions
 */
router.get('/:id/transactions', authorizePlayers, validate({ query: <AllowedSchema>transaction }), playersController.getPlayerTransactions);

/**
 * @openapi
 * /players/{id}/transactions:
 *   post:
 *     summary: Post a transaction.
*     tags:
*          - players
*     parameters:
*         - in: path
*           name: id
*           required: true
*           example: "000001"
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
router.post('/:id/transactions', authorizePlayers, validate({ body: <AllowedSchema>create_wallet_transaction }), playersController.createPlayerTransaction);


export default router;
