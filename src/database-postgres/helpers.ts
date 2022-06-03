import  { QueryFile } from 'pg-promise';
import path from 'path';

function executeQueryFromSqlFile(filePath: string): QueryFile {
    const options = {
        minify: true
    };

    const qf = new QueryFile(filePath, options);

    if (qf.error) {
        console.error(qf.error); // eslint-disable-line
    }

    return qf;
}

export const scripts = [
    executeQueryFromSqlFile(path.join(__dirname,'./scripts/001-populate-player-tables.sql'))
];

export const tables: Record<string, QueryFile> = {
    PLAYER_HUB: executeQueryFromSqlFile(path.join(__dirname, './tables/PLAYER_HUB.sql')),
    PLAYER_SAT: executeQueryFromSqlFile(path.join(__dirname, './tables/PLAYER_SAT.sql')),
    PLAYER_SESSION_LINK: executeQueryFromSqlFile(path.join(__dirname,'./tables/PLAYER_SESSION_LINK.sql')),
    PLAYER_WALLET_LINK: executeQueryFromSqlFile(path.join(__dirname,'./tables/PLAYER_WALLET_LINK.sql')),
    SESSION_HUB: executeQueryFromSqlFile(path.join(__dirname,'./tables/SESSION_HUB.sql')),
    SESSION_SAT: executeQueryFromSqlFile(path.join(__dirname,'./tables/SESSION_SAT.sql')),
    TRANSACTION_HUB: executeQueryFromSqlFile(path.join(__dirname,'./tables/TRANSACTION_HUB.sql')),
    TRANSACTION_SAT: executeQueryFromSqlFile(path.join(__dirname,'./tables/TRANSACTION_SAT.sql')),
    WALLET_HUB: executeQueryFromSqlFile(path.join(__dirname,'./tables/WALLET_HUB.sql')),
    WALLET_SAT: executeQueryFromSqlFile(path.join(__dirname,'./tables/WALLET_SAT.sql')),
    WALLET_TRANSACTION_LINK: executeQueryFromSqlFile(path.join(__dirname,'./tables/WALLET_TRANSACTION_LINK.sql')),
    SESSION_TRANSACTION_LINK: executeQueryFromSqlFile(path.join(__dirname,'./tables/SESSION_TRANSACTION_LINK.sql'))
};

export const selectQueries: Record<string, QueryFile> = {
    CURRENT_WALLET_BALANCE: executeQueryFromSqlFile(path.join(__dirname,'./queries-select/CURRENT_WALLET_BALANCE.sql')),
    SESSIONS: executeQueryFromSqlFile(path.join(__dirname,'./queries-select/SESSIONS.sql')),
    TRANSACTIONS: executeQueryFromSqlFile(path.join(__dirname,'./queries-select/TRANSACTIONS.sql')),
    PLAYERS: executeQueryFromSqlFile(path.join(__dirname,'./queries-select/PLAYERS.sql')),
    WALLETS: executeQueryFromSqlFile(path.join(__dirname,'./queries-select/WALLETS.sql')),
};

export const insertQueries: Record<string, QueryFile> = {
    CREATE_PLAYER_WALLET: executeQueryFromSqlFile(path.join(__dirname,'./queries-insert/CREATE_PLAYER_WALLET.sql')),
    CREATE_WALLET_TRANSACTION: executeQueryFromSqlFile(path.join(__dirname,'./queries-insert/CREATE_WALLET_TRANSACTION.sql')),
    OPEN_PLAYER_SESSION: executeQueryFromSqlFile(path.join(__dirname,'./queries-insert/OPEN_PLAYER_SESSION.sql')),
};
