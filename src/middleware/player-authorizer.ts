import { Request, Response, NextFunction } from 'express';
import * as basicAuth from 'express-basic-auth';
import passwords from '../passwords.json';

type User = keyof typeof passwords.users;
const users: User[] = <User[]>Object.keys(passwords.users); 

export default async function authorizePlayers(req: Request, res: Response, next: NextFunction): Promise<void> {
    let isAuthorized = false;

    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    users.forEach((user: User) => {
        if (login && password && login === req.params.id && basicAuth.safeCompare(password,passwords.users[user])) {
            isAuthorized = true;
        }
    });

    if(login === Object.keys(passwords.admin)[0] && password && basicAuth.safeCompare(password, passwords.admin.admin)) {
        isAuthorized = true;
    }


    if(!isAuthorized) {
        res.status(401).send("Authorization required");
    } else {
        next();
    }
}
