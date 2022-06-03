import { Router, Request, Response } from 'express';
import { AllowedSchema, Validator } from 'express-json-validator-middleware';
import session from '../schemas/session.json';
import transaction from '../schemas/transaction.json';
import open_player_session from '../schemas/open_player_session.json';
import controllers from '../controllers';

const { sessionsController } = controllers;

const router = Router();
const { validate } = new Validator({});

/**
 * @openapi
 * /sessions:
 *   get:
*     summary: Get sessions
*     tags:
 *      - sessions 
 *     responses:
 *       200:
 *         description: Sessions info
 */
router.get('/', validate({ query: <AllowedSchema>session }), sessionsController.getSessions);

/**
 * @openapi
 * /sessions:
 *   post:
*      summary: Create a new session.
*      tags:
*       - sessions
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*               type: object
*               properties:
*                   playerId:
*                       type: string
*                   sessionId:
*                       type: string
*            example:
*               playerId: "000001"
*               sessionId: "100"
*      responses:
*        201:
*          description: Created
 */
router.post('/', validate({ body: <AllowedSchema>open_player_session }), sessionsController.createSession);


/**
 * @openapi
 * /sessions/{id}:
 *   get:
 *     summary: Get a single session.
*     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            example: "001"
 *     tags:
 *      - sessions 
 *     responses:
 *       200:
 *         description: Info about a session
 */
router.get('/:id', validate({ query: <AllowedSchema>session }), sessionsController.getSession);


/**
 * @openapi
 * /sessions/{id}/transactions:
 *   get:
*     summary: Get session transactions. 
*     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            example: "001"
*     tags:
 *      - sessions
 *     responses:
 *       200:
 *         description: Returns session transactions
 */
router.get('/:id/transactions', validate({ query: <AllowedSchema>transaction }), sessionsController.getSessionTransactions);

export default router;
