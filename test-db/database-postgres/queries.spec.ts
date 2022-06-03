import "dotenv/config";
import pgPromise, { IMain, QueryFile } from "pg-promise";
import pg, { IConnectionParameters } from "pg-promise/typescript/pg-subset";
import path from "path";
import { expect } from "chai";
import { tables, selectQueries, insertQueries } from "database-postgres/helpers";

import executeQueryFromSqlFile from "./helper";


describe("Queries are working as expected", function () {
    let db: pgPromise.IDatabase<unknown, pg.IClient>;
    const pgp: IMain = pgPromise({});

    beforeEach(async function () {
        const connection: IConnectionParameters = {
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            database: "postgres",
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            allowExitOnIdle: true
        };

        db = pgp(connection);

        await db.none("DROP DATABASE IF EXISTS $1:name", [process.env.TEST_DB]);
        await db.none("CREATE DATABASE $1:name", [process.env.TEST_DB]);

        db = pgp({
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            database: process.env.TEST_DB,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
        });

        await Promise.all(
            Object.keys(tables).map(table => db.none(<QueryFile>tables[table]))
        );

        await db.none(executeQueryFromSqlFile(path.join(__dirname, 'test-data.sql')));
    });

    it("Test data is loaded with correct number of entries", async function () {
        expect(await db.one("SELECT COUNT(*) FROM PLAYER_HUB")).to.be.eql({count: "20"});
        expect(await db.one("SELECT COUNT(*) FROM PLAYER_SAT")).to.be.eql({count: "20"});
        expect(await db.one("SELECT COUNT(*) FROM SESSION_HUB")).to.be.eql({count: "6"});
        expect(await db.one("SELECT COUNT(*) FROM SESSION_SAT")).to.be.eql({count: "6"});
        expect(await db.one("SELECT COUNT(*) FROM WALLET_HUB")).to.be.eql({count: "4"});
        expect(await db.one("SELECT COUNT(*) FROM WALLET_SAT")).to.be.eql({count: "4"});
        expect(await db.one("SELECT COUNT(*) FROM TRANSACTION_HUB")).to.be.eql({count: "30"});
        expect(await db.one("SELECT COUNT(*) FROM TRANSACTION_SAT")).to.be.eql({count: "30"});
        expect(await db.one("SELECT COUNT(*) FROM PLAYER_SESSION_LINK")).to.be.eql({count: "6"});
        expect(await db.one("SELECT COUNT(*) FROM PLAYER_WALLET_LINK")).to.be.eql({count: "4"});
        expect(await db.one("SELECT COUNT(*) FROM WALLET_TRANSACTION_LINK")).to.be.eql({count: "30"});
        expect(await db.one("SELECT COUNT(*) FROM SESSION_TRANSACTION_LINK")).to.be.eql({count: "30"});
    });

    describe('Select queries return the expected results', function() {
        it('CURRENT_WALLET_BALANCE returns expected results', async function() {
            expect((await db.any(selectQueries.CURRENT_WALLET_BALANCE, {
                playerId: null,
                walletId: null,
                currencyCode: null,
                firstName: null,
                lastName: null,
            })).length).to.be.eql(3);
            
            expect((await db.any(selectQueries.CURRENT_WALLET_BALANCE, {
                playerId: '000001',
                walletId: null,
                currencyCode: null,
                firstName: null,
                lastName: null,
            })).length).to.be.eql(1);
            
            expect((await db.any(selectQueries.CURRENT_WALLET_BALANCE, {
                playerId: null,
                walletId: null,
                currencyCode: null,
                firstName: null,
                lastName: null,
            }))[0]).to.have.all.keys(
                'amount',
                'closing_balance',
                'currency_code',
                'first_name',
                'last_name',
                'opening_balance',
                'player_id',
                'wallet_id'
            );
        });

        it('SESSIONS returns expected results', async function() {
            expect((await db.any(selectQueries.SESSIONS, {
                playerId: '000003',
                sessionId: null,
                firstName: null,
                lastName: null
            })).length).to.be.eql(2);

            expect((await db.any(selectQueries.SESSIONS, {
                playerId: null,
                sessionId: null,
                firstName: null,
                lastName: null
            })).length).to.be.eql(6);

            expect((await db.any(selectQueries.SESSIONS, {
                playerId: null,
                sessionId: null,
                firstName: null,
                lastName: null
            }))[0]).to.have.all.keys(
                'first_name',
                'last_name',
                'player_id',
                'session_id',
                'session_start_date',
                "load_date",
                'record_source'
            );

        });

        it('TRANSACTIONS returns expected results', async function() {
            expect((await db.any(selectQueries.TRANSACTIONS, {
                playerId: null,
                firstName: null,
                lastName: null,
                transactionId: null,
                transactionType: null,
                currencyCode: null,
                sessionId: null,
                walletId: null
            })).length).to.be.eql(30);

            expect((await db.any(selectQueries.TRANSACTIONS, {
                playerId: '000001',
                firstName: null,
                lastName: null,
                transactionId: null,
                transactionType: null,
                currencyCode: null,
                sessionId: null,
                walletId: null
            })).length).to.be.eql(10);

            expect((await db.any(selectQueries.TRANSACTIONS, {
                playerId: null,
                firstName: null,
                lastName: null,
                transactionId: null,
                transactionType: null,
                currencyCode: null,
                sessionId: null,
                walletId: null
            }))[0]).to.have.all.keys(
                'amount',
                'closing_balance',
                'currency_code',
                'first_name',
                'last_name',
                'opening_balance',
                'player_id',
                'session_id',
                'transaction_date',
                'transaction_id',
                'transaction_type',
                'load_date',
                "wallet_id"
            );
        });



    });

    describe('Insert queries return the expected results', function() {
        it('CREATE PLAYER WALLET inserts data into correct tables', async function() {
            const walletHubLength = Number((await db.one("SELECT COUNT(*) FROM WALLET_HUB")).count)
            const walletSatLength = Number((await db.one("SELECT COUNT(*) FROM WALLET_SAT")).count)
            const playerWalletLink = Number((await db.one("SELECT COUNT(*) FROM PLAYER_WALLET_LINK")).count)
        
            await db.none(insertQueries.CREATE_PLAYER_WALLET, {
                walletId: '005',
                recordSource: '127.0.0.1',
                openingBalance: 100,
                currencyCode: 'GBP',
                playerId: '000007'
            });

            expect(Number((await db.one("SELECT COUNT(*) FROM WALLET_HUB")).count)).to.eql(walletHubLength + 1);
            expect(Number((await db.one("SELECT COUNT(*) FROM WALLET_SAT")).count)).to.eql(walletSatLength + 1);
            expect(Number((await db.one("SELECT COUNT(*) FROM PLAYER_WALLET_LINK")).count)).to.eql(playerWalletLink + 1);

        });

        it('CREATE WALLET TRANSACTION inserts data into correct tables', async function() {
            const transactionHubLength = Number((await db.one("SELECT COUNT(*) FROM TRANSACTION_HUB")).count)
            const transactionSatLength = Number((await db.one("SELECT COUNT(*) FROM TRANSACTION_SAT")).count)
            const walletTransactionLink = Number((await db.one("SELECT COUNT(*) FROM WALLET_TRANSACTION_LINK")).count)
            const sessionTransactionLink = Number((await db.one("SELECT COUNT(*) FROM SESSION_TRANSACTION_LINK")).count)
        
            await db.none(insertQueries.CREATE_WALLET_TRANSACTION, {
                transactionId: '000-031',
                recordSource: '127.0.0.1',
                walletId: '006',
                sessionId: '006',
                amount: -10,
                openingBalance: 110,
                closingBalance: 100,
                transactionType: 'Bet',
            });

            expect(Number((await db.one("SELECT COUNT(*) FROM TRANSACTION_HUB")).count)).to.eql(transactionHubLength + 1);
            expect(Number((await db.one("SELECT COUNT(*) FROM TRANSACTION_SAT")).count)).to.eql(transactionSatLength + 1);
            expect(Number((await db.one("SELECT COUNT(*) FROM WALLET_TRANSACTION_LINK")).count)).to.eql(walletTransactionLink + 1);
            expect(Number((await db.one("SELECT COUNT(*) FROM SESSION_TRANSACTION_LINK")).count)).to.eql(sessionTransactionLink + 1);

        });

        it('OPEN PLAYER SESSION inserts data into correct tables', async function() {
            const sessionHubLength = Number((await db.one("SELECT COUNT(*) FROM SESSION_HUB")).count)
            const sessionSatLength = Number((await db.one("SELECT COUNT(*) FROM SESSION_SAT")).count)
            const playerSessionLink = Number((await db.one("SELECT COUNT(*) FROM PLAYER_SESSION_LINK")).count)
        
            await db.none(insertQueries.OPEN_PLAYER_SESSION, {
                sessionId: '010',
                recordSource: '127.0.0.1',
                playerId: '001'
            });

            expect(Number((await db.one("SELECT COUNT(*) FROM SESSION_HUB")).count)).to.eql(sessionHubLength + 1);
            expect(Number((await db.one("SELECT COUNT(*) FROM SESSION_SAT")).count)).to.eql(sessionSatLength + 1);
            expect(Number((await db.one("SELECT COUNT(*) FROM PLAYER_SESSION_LINK")).count)).to.eql(playerSessionLink + 1);

        });


    });

    afterEach(async function() {
        await pgp.end();
    });
});




