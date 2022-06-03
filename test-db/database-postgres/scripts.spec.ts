import "dotenv/config";
import pgPromise, { IMain, QueryFile } from "pg-promise";
import pg, { IConnectionParameters } from "pg-promise/typescript/pg-subset";
import { scripts, tables } from "database-postgres/helpers";
import { expect } from "chai";

describe("All scripts are correctly executed", function () {
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

        return Promise.all(scripts.map(script => db.none(script)));
    });

    it("Scripts are executed without error, and return correct number of entries", async function () {
        expect(await db.one("SELECT COUNT(*) FROM PLAYER_HUB")).to.be.eql({count: "20"});
        expect(await db.one("SELECT COUNT(*) FROM PLAYER_SAT")).to.be.eql({count: "20"});
    });

    afterEach(async function() {
        await pgp.end();
    });
});