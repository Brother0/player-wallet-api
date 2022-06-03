import { Request, Response } from 'express';
import pgPromise from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import { selectQueries, insertQueries } from '../database-postgres/helpers';

async function getWallets(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {
    const result = await db.any(selectQueries.WALLETS, {
        playerId: null,
        walletId: null,
        currencyCode: null,
        firstName: null,
        lastName: null,
    });
    res.status(200).send({
        data: result.map(row => ({
            ...row,
            opening_balance: Number(row.opening_balance)
        }))
    });
}

async function getSingleWallet(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {
    const result = await db.any(selectQueries.WALLETS, {
        playerId: null,
        walletId: req.params.id,
        currencyCode: null,
        firstName: null,
        lastName: null,
    });
    res.status(200).send({
        data: result.map(row => ({
            ...row,
            opening_balance: Number(row.opening_balance)
        }))
    });
}


async function getWalletTransactions(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {
    const result = await db.any(selectQueries.TRANSACTIONS, {
        playerId: null,
        sessionId: req.query.sessionId || null,
        firstName: null,
        lastName: null,
        transactionId: null,
        transactionType: req.query.transactionType || null,
        currencyCode: null,
        walletId: req.params.id
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


async function createWallet(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {
    const wallets = await db.any(selectQueries.WALLETS, {
        playerId: null,
        walletId: null,
        currencyCode: null,
        firstName: null,
        lastName: null
    });

    const players = await db.any(selectQueries.PLAYERS, {
        playerId: req.body.playerId,
        firstName: null,
        lastName: null,
    });

    if(!players.find(player => player.player_id === req.body.playerId)) {
        res.status(409).send("Player does not exist")        
        return;
    }

    if(wallets.find(wallet => wallet.player_id === req.body.playerId)) {
        res.status(409).send("The player already has a wallet in the system. Only one wallet allowed")
        return;
    }

    if(wallets.find(row => row.wallet_id === req.body.walletId)) {
        res.status(409).send("Wallet with this id already exists. Please change the id")
        return;
    }


    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login] = Buffer.from(b64auth, 'base64').toString().split(':')

    await db.none(insertQueries.CREATE_PLAYER_WALLET, {
        walletId: req.body.walletId,
        openingBalance: req.body.openingBalance,
        currencyCode: req.body.currencyCode,
        playerId: req.body.playerId,
        recordSource: login
    });

    res.status(201).send(`Wallet with id ${req.body.walletId} was created for player ${req.body.playerId}.`);

}

export default {
    getWallets,
    getSingleWallet,
    getWalletTransactions,
    createWallet
}