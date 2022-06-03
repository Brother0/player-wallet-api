CREATE TABLE WALLET_SAT (
    WALLET_HKEY CHAR(32) NOT NULL,
    LOAD_DATE TIMESTAMP NOT NULL,
    RECORD_SOURCE VARCHAR(50) NOT NULL,
    OPENING_BALANCE NUMERIC(15, 2) NULL,
    CURRENCY_CODE CHAR(3) NULL,

    CONSTRAINT PK_WALLET_SAT PRIMARY KEY  (
        WALLET_HKEY,
        LOAD_DATE
    )
);


comment on table WALLET_SAT is 'Wallet attributes';
comment on column WALLET_SAT.WALLET_HKEY is 'Wallet hash key';
comment on column WALLET_SAT.LOAD_DATE is 'Load time';
comment on column WALLET_SAT.OPENING_BALANCE is 'Starting wallet balance denominated in wallet currency';
comment on column WALLET_SAT.CURRENCY_CODE is 'Currency code';
comment on column WALLET_SAT.RECORD_SOURCE is 'Origin';

-- used to get latest wallet data
CREATE VIEW WALLET_SAT_LATEST AS
    SELECT WALLET_SAT.* FROM WALLET_SAT
    INNER JOIN
    (
        SELECT WALLET_HKEY, MAX(LOAD_DATE) from WALLET_SAT
        GROUP BY WALLET_HKEY
    ) LATEST_WALLET_LOAD
    ON WALLET_SAT.WALLET_HKEY = LATEST_WALLET_LOAD.WALLET_HKEY
