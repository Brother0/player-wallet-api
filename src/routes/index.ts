import * as basicAuth from 'express-basic-auth';
import { Router } from 'express';
import passwords from  '../passwords.json';

import docs from './docs';
import players from './players';
import sessions from './sessions';
import transactions from './transactions';
import wallets from './wallets';


const router = Router();

router.use(`/api/${<string>process.env.API_VERSION}/docs`, docs);

router.use(`/api/${<string>process.env.API_VERSION}/players`, players);

router.use(`/api/${<string>process.env.API_VERSION}/wallets`,basicAuth.default({
    users: passwords.admin,
    challenge: true
}));

router.use(`/api/${<string>process.env.API_VERSION}/wallets`, wallets);

router.use(`/api/${<string>process.env.API_VERSION}/sessions`,basicAuth.default({
    users: passwords.admin,
    challenge: true
}));
router.use(`/api/${<string>process.env.API_VERSION}/sessions`, sessions);

router.use(`/api/${<string>process.env.API_VERSION}/transactions`,basicAuth.default({
    users: passwords.admin,
    challenge: true
}));
router.use(`/api/${<string>process.env.API_VERSION}/transactions`, transactions);

export default router;
