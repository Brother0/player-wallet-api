require('dotenv').config();
const pgPromise = require('pg-promise');
const { QueryFile } = require('pg-promise');
const path = require('path');

async function prepareDatabase() {

    let db;
    const pgp = pgPromise({});
    
    const connection = {
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: "postgres",
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        allowExitOnIdle: true
    };
    
    db = pgp(connection);
    
    await db.none("CREATE DATABASE $1:name", process.env.PROD_DB);
    await db.none("CREATE DATABASE $1:name", process.env.DEV_DB);
    await db.none("CREATE DATABASE $1:name", process.env.TEST_DB);
    
    db = pgp({
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: process.env.TEST_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
    });
    
    await Promise.all(
        Object.keys(tables).map(table => db.none(tables[table])));
    await db.none(executeQueryFromSqlFile(path.join(__filename, '../../test-db/database-postgres/test-data.sql')));
    
    
    db = pgp({
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: process.env.PROD_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
    });
    
    await Promise.all(Object.keys(tables).map(table => db.none(tables[table])));
    await Promise.all(scripts.map(script => db.none(script)));
    
    db = pgp({
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: process.env.DEV_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
    });
    
    await Promise.all(Object.keys(tables).map(table => db.none(tables[table])));
    await Promise.all(scripts.map(script => db.none(script)));

}

prepareDatabase();





function executeQueryFromSqlFile(filePath) {
    const options = {
        minify: true
    };

    const qf = new QueryFile(filePath, options);

    if (qf.error) {
        console.error(qf.error); // eslint-disable-line
    }

    return qf;
}

const scripts = [
    executeQueryFromSqlFile(path.join(__filename, '../../src/database-postgres/scripts/001-populate-player-tables.sql'))
];

const tables = {
    PLAYER_HUB: executeQueryFromSqlFile(path.join(__filename,'../../src/database-postgres/tables/PLAYER_HUB.sql')),
    PLAYER_SAT: executeQueryFromSqlFile(path.join(__filename,'../../src/database-postgres/tables/PLAYER_SAT.sql')),
    PLAYER_SESSION_LINK: executeQueryFromSqlFile(path.join(__filename,'../../src/database-postgres/tables/PLAYER_SESSION_LINK.sql')),
    PLAYER_WALLET_LINK: executeQueryFromSqlFile(path.join(__filename,'../../src/database-postgres/tables/PLAYER_WALLET_LINK.sql')),
    SESSION_HUB: executeQueryFromSqlFile(path.join(__filename,'../../src/database-postgres/tables/SESSION_HUB.sql')),
    SESSION_SAT: executeQueryFromSqlFile(path.join(__filename,'../../src/database-postgres/tables/SESSION_SAT.sql')),
    TRANSACTION_HUB: executeQueryFromSqlFile(path.join(__filename,'../../src/database-postgres/tables/TRANSACTION_HUB.sql')),
    TRANSACTION_SAT: executeQueryFromSqlFile(path.join(__filename,'../../src/database-postgres/tables/TRANSACTION_SAT.sql')),
    WALLET_HUB: executeQueryFromSqlFile(path.join(__filename,'../../src/database-postgres/tables/WALLET_HUB.sql')),
    WALLET_SAT: executeQueryFromSqlFile(path.join(__filename,'../../src/database-postgres/tables/WALLET_SAT.sql')),
    WALLET_TRANSACTION_LINK: executeQueryFromSqlFile(path.join(__filename,'../../src/database-postgres/tables/WALLET_TRANSACTION_LINK.sql')),
    SESSION_TRANSACTION_LINK: executeQueryFromSqlFile(path.join(__filename,'../../src/database-postgres/tables/SESSION_TRANSACTION_LINK.sql'))
};
