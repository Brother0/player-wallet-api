import { Request, Response } from 'express';
import pgPromise from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import { selectQueries, insertQueries } from '../database-postgres/helpers';

async function getPlayers(req: Request, res: Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient>): Promise<void> {
    const result = (await db.any(selectQueries.PLAYERS, { firstName:null, lastName:null, playerId: null })).map(row => ({
        player_id: row.player_id, first_name: row.first_name, last_name: row.last_name,
    }));

    res.status(200).send(result);
}

async function getPlayer(req: Request, res: Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient>): Promise<void> {
    const result = await db.oneOrNone(selectQueries.PLAYERS, {
        playerId: req.params.id,
        firstName: null,
        lastName: null,
    });

    if(result) {
        res.status(200).send(result);
    } else {
        res.status(404).send('Player does not exist')
    }
}


async function getPlayerWallet(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {
    const result = await db.oneOrNone(selectQueries.WALLETS, {
        playerId: req.params.id,
        walletId: null,
        currencyCode: null,
        firstName: null,
        lastName: null
    });

    if(result) {
        result.opening_balance = Number(result.opening_balance);
        res.status(200).send(result);
    } else {
        if(await db.oneOrNone(selectQueries.PLAYERS, {
            playerId: req.params.id,
            firstName: null,
            lastName: null,
        })) {
            res.status(404).send('Player does not have a wallet');
        }

        res.status(404).send('Player does not exist');
    }
}

async function getPlayerSessions(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {
    const result = await db.any(selectQueries.SESSIONS, {
        playerId: req.params.id,
        sessionId: req.query.sessionId || null,
        firstName: null,
        lastName: null
    });
    res.status(200).send({
        data: result
    });
}

async function getPlayerTransactions(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {
    const result = await db.any(selectQueries.TRANSACTIONS, {
        playerId: req.params.id,
        sessionId: req.query.sessionId || null,
        firstName: null,
        lastName: null,
        transactionId: null,
        transactionType: req.query.transactionType || null,
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


async function createPlayerWallet(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {
    const wallets = await db.any(selectQueries.WALLETS, {
        playerId: null,
        walletId: null,
        currencyCode: null,
        firstName: null,
        lastName: null
    });

    const players = await db.any(selectQueries.PLAYERS, {
        playerId: req.params.id,
        firstName: null,
        lastName: null,
    });

    if(!players.find(player => player.player_id === req.params.id)) {
        res.status(409).send("Player does not exist")
        return;
    }

    if(wallets.find(wallet => wallet.player_id === req.params.id)) {
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
        playerId: req.params.id,
        recordSource: login
    });

    res.status(201).send(`Wallet with id ${req.body.walletId} was created for player ${req.params.id}.`);

}

async function createPlayerSession(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {
    const sessions = await db.any(selectQueries.SESSIONS, {
        playerId: null,
        sessionId: null,
        firstName: null,
        lastName: null
    });

    const players = await db.any(selectQueries.PLAYERS, {
        playerId: req.params.id,
        firstName: null,
        lastName: null,
    });

    if(!players.find(player => player.player_id === req.params.id)) {
        res.status(409).send("Player does not exist");
        return;        
    }

    if(sessions.find(row => row.session_id === req.body.sessionId)) {
        res.status(409).send("Session with this id already exists. Please change the id");
        return;
    }


    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login] = Buffer.from(b64auth, 'base64').toString().split(':')

    await db.none(insertQueries.OPEN_PLAYER_SESSION, {
        sessionId: req.body.sessionId,
        playerId: req.params.id,
        recordSource: login
    });

    res.status(201).send(`Session with id ${req.body.sessionId} was created for player ${req.params.id}.`);
}

async function createPlayerTransaction(req: Request, res:Response, db: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> ): Promise<void> {

    const players = await db.any(selectQueries.PLAYERS, {
        playerId: req.params.id,
        firstName: null,
        lastName: null,
    });

    if(players.length < 1) {
        res.status(409).send(`Player does not exist`)
        return;
    }

    const sessions = await db.any(selectQueries.SESSIONS, {
        playerId: req.params.id,
        sessionId: req.body.sessionId,
        firstName: null,
        lastName: null
    });

    if(sessions.length < 1) {
        res.status(409).send(`No session exists for player ${req.params.id}. Open a session before continuing.`)
        return;
    }

    const wallets = await db.any(selectQueries.WALLETS, {
        playerId: req.params.id,
        walletId: req.body.walletId,
        currencyCode: null,
        firstName: null,
        lastName: null
    });

    if(wallets.length < 1) {
        res.status(409).send(`Player does not have a wallet open. Open a wallet first.`)
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
        res.status(409).send(`Transaction with id ${req.body.transactionId} already exists in the system.`);
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

    res.status(201).send(`Transaction with id ${req.body.transactionId} was created for player ${req.params.id}.`);

}
export default {
    getPlayers,
    getPlayer,
    getPlayerWallet,
    getPlayerSessions,
    getPlayerTransactions,
    createPlayerWallet,
    createPlayerSession,
    createPlayerTransaction
}