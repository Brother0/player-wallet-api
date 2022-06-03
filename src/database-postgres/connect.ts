import 'dotenv/config';
import pgPromise, { IMain } from 'pg-promise';
import { IConnectionParameters } from 'pg-promise/typescript/pg-subset';

let pgp: IMain = pgPromise({});

switch (process.env.NODE_ENV) {
case 'development':
    pgp = pgPromise({
        query(e) {
                console.log('QUERY RESULT:', e.query);  // eslint-disable-line
        },
        receive(data, result, e) {
                console.log(`DATA FROM QUERY ${e.query} WAS RECEIVED.`); // eslint-disable-line
        },
    });
    break;
case 'test':
    pgp = pgPromise({
        query(e) {
                console.log('QUERY RESULT:', e.query);  // eslint-disable-line
        },
        receive(data, result, e) {
                console.log(`DATA FROM QUERY ${e.query} WAS RECEIVED.`); // eslint-disable-line
        }
    });
    break;
default:
}

const connection: IConnectionParameters = {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.NODE_ENV,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
};

const db = pgp(connection);

export default db;
