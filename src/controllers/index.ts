import { Request, Response } from 'express';
import playersController from "./players-controller";
import sessionsController from "./sessions-controller";
import transactionsController from "./transactions-controller";
import walletsController from "./wallets-controller";
import db from '../database-postgres/connect';

export default {
    playersController: {
        getPlayers: async (req: Request, res: Response): Promise<void> => playersController.getPlayers(req, res, db),
        getPlayer: async (req: Request, res: Response): Promise<void> => playersController.getPlayer(req, res, db),
        getPlayerWallet: async (req: Request, res: Response): Promise<void> => playersController.getPlayerWallet(req, res, db),
        getPlayerSessions: async (req: Request, res: Response): Promise<void> => playersController.getPlayerSessions(req, res, db),
        getPlayerTransactions: async (req: Request, res: Response): Promise<void> => playersController.getPlayerTransactions(req, res, db),
        createPlayerWallet: async (req: Request, res: Response): Promise<void> => playersController.createPlayerWallet(req, res, db),
        createPlayerSession: async (req: Request, res: Response): Promise<void> => playersController.createPlayerSession(req, res, db),
        createPlayerTransaction: async (req: Request, res: Response): Promise<void> => playersController.createPlayerTransaction(req, res, db),
    },
    sessionsController: {
        getSession: async (req: Request, res: Response): Promise<void> => sessionsController.getSession(req, res, db),
        getSessions: async (req: Request, res: Response): Promise<void> => sessionsController.getSessions(req, res, db),
        getSessionTransactions: async (req: Request, res: Response): Promise<void> => sessionsController.getSessionTransactions(req, res, db),
        createSession: async (req: Request, res: Response): Promise<void> => sessionsController.createSession(req, res, db),
    },
    transactionsController: {
        getTransactions: async (req: Request, res: Response): Promise<void> => transactionsController.getTransactions(req, res, db),
        getSingleTransaction: async (req: Request, res: Response): Promise<void> => transactionsController.getSingleTransaction(req, res, db),
        createTransaction: async (req: Request, res: Response): Promise<void> => transactionsController.createTransaction(req, res, db),
    },
    walletsController: {
        getWallets: async (req: Request, res: Response): Promise<void> => walletsController.getWallets(req, res, db),
        getSingleWallet: async (req: Request, res: Response): Promise<void> => walletsController.getSingleWallet(req, res, db),
        getWalletTransactions: async (req: Request, res: Response): Promise<void> => walletsController.getWalletTransactions(req, res, db),
        createWallet: async (req: Request, res: Response): Promise<void> => walletsController.createWallet(req, res, db),
    }
}