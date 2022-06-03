import { Request, Response } from 'express';
import pgPromise from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import { selectQueries, insertQueries } from '../database-postgres/helpers';

async function getTransactions(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {
    const result = await db.any(selectQueries.TRANSACTIONS, {
        playerId: null,
        sessionId: null,
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

async function getSingleTransaction(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {
    const result = await db.any(selectQueries.TRANSACTIONS, {
        playerId: null,
        sessionId: null,
        firstName: null,
        lastName: null,
        transactionId: req.params.id,
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


async function createTransaction(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {

    const players = await db.any(selectQueries.PLAYERS, {
        playerId: req.body.playerId,
        firstName: null,
        lastName: null,
    });

    if(players.length < 1) {
        res.status(409).send(`Player does not exist`)
        return;
    }

    const sessions = await db.any(selectQueries.SESSIONS, {
        playerId: req.body.playerId,
        sessionId: req.body.sessionId,
        firstName: null,
        lastName: null
    });

    if(sessions.length < 1) {
        res.status(409).send(`No session exists for player ${req.body.playerId}. Open a session before continuing.`)
        return;
    }

    const wallets = await db.any(selectQueries.WALLETS, {
        playerId: req.body.playerId,
        walletId: req.body.walletId,
        currencyCode: null,
        firstName: null,
        lastName: null
    });

    if(wallets.length < 1) {
        res.status(409).send(`Player does not have a wallet open. Open a wallet first.`);
        return;
    }


    const transactions = await db.any(selectQueries.TRANSACTIONS, {
        playerId: null,
        sessionId: null,
        firstName: null,
        lastName: null,
        transactionId: null,
        transactionType: null,
        currencyCode: null,
        walletId: null
    });

    if(transactions.find(transaction => transaction.transaction_id === req.body.transactionId)) {
        res.status(409).send(`Transaction with id ${req.body.transactionId} already exists in the system.`)
        return;
    }

    const openingBalance = Number(transactions.find(transaction => transaction.wallet_id === req.body.walletId)?.closing_balance) || Number(wallets.find(wallet => wallet.wallet_id === req.body.walletId).opening_balance);

    if(openingBalance + Number(req.body.amount) * (req.body.transactionType === 'Bet' ? 1 : -1) < 0) {
        res.status(409).send(`Not enough funds`);
        return;
    }

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login] = Buffer.from(b64auth, 'base64').toString().split(':')

    await db.none(insertQueries.CREATE_WALLET_TRANSACTION, {
        transactionId: req.body.transactionId,
        amount: Number(req.body.amount),
        openingBalance,
        closingBalance: openingBalance + Number(req.body.amount) * (req.body.transactionType === 'Bet' ? 1 : -1),
        transactionType: req.body.transactionType,
        walletId: req.body.walletId,
        sessionId: req.body.sessionId,
        recordSource: login
    });

    res.status(201).send(`Transaction with id ${req.body.transactionId} was created for player ${req.body.playerId}.`);

}

export default {
    getTransactions,
    getSingleTransaction,
    createTransaction
}