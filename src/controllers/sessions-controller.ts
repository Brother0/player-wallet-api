import { Request, Response } from 'express';
import pgPromise from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import { selectQueries, insertQueries } from '../database-postgres/helpers';

async function getSessions(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {
    const result = await db.any(selectQueries.SESSIONS, {
        playerId: req.query.playerId || null,
        sessionId: req.query.sessionId || null,
        firstName: null,
        lastName: null
    });
    res.status(200).send({
        data: result,
    });
}

async function getSession(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {
    const result = await db.any(selectQueries.SESSIONS, {
        playerId: null,
        sessionId: req.params.id,
        firstName: null,
        lastName: null
    });
    res.status(200).send({
        data: result,
    });
}

async function getSessionTransactions(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {
    const result = await db.any(selectQueries.TRANSACTIONS, {
        playerId: null,
        sessionId: req.params.id,
        firstName: null,
        lastName: null,
        transactionId: null,
        transactionType: null,
        currencyCode: null,
        walletId: null
    });
    res.status(200).send({
        data: result.map(row => ({
            ...row,
            amount: Number(row.amount),
            closing_balance: Number(row.closing_balance),
            opening_balance: Number(row.opening_balance)
        }))
    });
}

async function createSession(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {
    const sessions = await db.any(selectQueries.SESSIONS, {
        playerId: null,
        sessionId: null,
        firstName: null,
        lastName: null
    });

    const players = await db.any(selectQueries.PLAYERS, {
        playerId: req.body.playerId,
        firstName: null,
        lastName: null,
    });

    if(!players.find(player => player.player_id === req.body.playerId)) {
        res.status(409).send("Player does not exist")  ;
        return;      
    }

    if(sessions.find(row => row.session_id === req.body.sessionId)) {
        res.status(409).send("Session with this id already exists. Please change the id")
        return;
    }


    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login] = Buffer.from(b64auth, 'base64').toString().split(':')

    await db.none(insertQueries.OPEN_PLAYER_SESSION, {
        sessionId: req.body.sessionId,
        playerId: req.body.playerId,
        recordSource: login
    });

    res.status(201).send(`Session with id ${req.body.sessionId} was created for player ${req.body.playerId}.`);
}

export default {
    getSessions,
    getSession,
    getSessionTransactions,
    createSession
}