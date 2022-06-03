import "dotenv/config";
import pgPromise, { IMain, QueryFile } from "pg-promise";
import pg, { IConnectionParameters } from "pg-promise/typescript/pg-subset";
import path from "path";
import { expect } from "chai";
import { tables, selectQueries, insertQueries } from "database-postgres/helpers";

import executeQueryFromSqlFile from "./helper";

describe("Table tests", function () {
    let db: pgPromise.IDatabase<unknown, pg.IClient>;
    const pgp: IMain = pgPromise({});
    
    before(async function () {
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

    after(async function() {
        await pgp.end();
    });

    describe("HUB tables are correctly created", function () {
        it("PLAYER_HUB is created with correct columns", async function () {
            expect(
                new Set(Object.keys((await db.any("SELECT * FROM player_hub"))[0]))
            ).to.be.eql(
                new Set<string>([
                    "load_date",
                    "player_hkey",
                    "player_id",
                    "record_source",
                ])
            );
        });

        it("TRANSACTION_HUB is created with correct columns", async function () {
            expect(
                new Set(Object.keys((await db.any("SELECT * FROM transaction_hub"))[0]))
                ).to.be.eql(
                new Set<string>([
                    "load_date",
                    "transaction_hkey",
                    "transaction_id",
                    "record_source",
                ])
            );
        });

        it("WALLET_HUB is created with correct columns", async function () {
            expect(
                new Set(Object.keys((await db.any("SELECT * FROM wallet_hub"))[0]))
            ).to.be.eql(
                new Set<string>([
                    "load_date",
                    "wallet_hkey",
                    "wallet_id",
                    "record_source",
                ])
            );
        });

        it("SESSION_HUB is created with correct columns", async function () {
            expect(
                new Set(Object.keys((await db.any("SELECT * FROM session_hub"))[0]))
            ).to.be.eql(
                new Set<string>([
                    "load_date",
                    "session_hkey",
                    "session_id",
                    "record_source",
                ])
            );
        });
    });

    describe("SAT tables are correctly created", function () {
        it("PLAYER_SAT is created with correct columns", async function () {
            expect(
                new Set(Object.keys((await db.any("SELECT * FROM player_sat"))[0]))
            ).to.be.eql(
                new Set<string>([
                    "load_date",
                    "player_hkey",
                    // ---------------------
                    "first_name",
                    "last_name",
                    "record_source",
                ])
            );
        });

        it("WALLET_SAT is created with correct columns", async function () {
            expect(
                new Set(Object.keys((await db.any("SELECT * FROM wallet_sat"))[0]))
            ).to.be.eql(
                new Set<string>([
                    "load_date",
                    "wallet_hkey",
                    // ---------------------
                    "opening_balance",
                    "currency_code",
                    "record_source",
                ])
            );
        });

        it("TRANSACTION_SAT is created with correct columns", async function () {
            expect(
                new Set(Object.keys((await db.any("SELECT * FROM transaction_sat"))[0]))
            ).to.be.eql(
                new Set<string>([
                    "load_date",
                    "transaction_hkey",
                    // ---------------------
                    "transaction_date",
                    "transaction_type",
                    "amount",
                    "opening_balance",
                    "closing_balance",
                    "transaction_number",
                    "record_source",
                ])
            );
        });

        it("SESSION_SAT is created with correct columns", async function () {
            expect(
                new Set(Object.keys((await db.any("SELECT * FROM session_sat"))[0]))
            ).to.be.eql(
                new Set<string>(["load_date", "session_hkey", "record_source", "session_start_date"])
            );
        });
    });

    describe("LINK tables are correctly created", function () {
        it("PLAYER_WALLET_LINK is created with correct columns", async function () {
            expect(
                new Set(Object.keys((await db.any("SELECT * FROM player_wallet_link"))[0]))
            ).to.be.eql(
                new Set<string>([
                    "player_wallet_hkey",
                    "player_hkey",
                    "wallet_hkey",
                    "load_date",
                    "record_source",
                ])
            );
        });

        it("PLAYER_SESSION_LINK is created with correct columns", async function () {
            expect(
                new Set(Object.keys((await db.any("SELECT * FROM player_session_link"))[0]))
            ).to.be.eql(
                new Set<string>([
                    "player_session_hkey",
                    "player_hkey",
                    "session_hkey",
                    "load_date",
                    "record_source",
                ])
            );
        });

        it("WALLET_TRANSACTION_LINK is created with correct columns", async function () {
            expect(
                new Set(
                    new Set(Object.keys((await db.any("SELECT * FROM wallet_transaction_link"))[0]))
                )
            ).to.be.eql(
                new Set<string>([
                    "wallet_transaction_hkey",
                    "wallet_hkey",
                    "transaction_hkey",
                    "load_date",
                    "record_source",
                ])
            );
        });

        it("SESSION_TRANSACTION_LINK is created with correct columns", async function () {
            expect(
                new Set(
                    new Set(Object.keys((await db.any("SELECT * FROM session_transaction_link"))[0]))
                )
            ).to.be.eql(
                new Set<string>([
                    "session_transaction_hkey",
                    "session_hkey",
                    "transaction_hkey",
                    "load_date",
                    "record_source",
                ])
            );
        });

    });
});