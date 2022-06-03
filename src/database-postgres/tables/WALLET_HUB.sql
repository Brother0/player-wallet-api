CREATE TABLE WALLET_HUB (
    LOAD_DATE TIMESTAMP NOT NULL,
    RECORD_SOURCE VARCHAR(50) NOT NULL,
    WALLET_ID VARCHAR(50) NOT NULL,
    WALLET_HKEY text GENERATED ALWAYS AS (md5(WALLET_ID::bytea)) STORED,

    CONSTRAINT PK_WALLET_HUB PRIMARY KEY  (
        WALLET_HKEY
    ),
    CONSTRAINT UQ_WALLET_LINK UNIQUE 
    (
        WALLET_ID
    )
);

comment on table WALLET_HUB is 'Wallets';
comment on column WALLET_HUB.WALLET_HKEY is 'Wallet hash key';
comment on column WALLET_HUB.LOAD_DATE is 'Load time';
comment on column WALLET_HUB.RECORD_SOURCE is 'Origin';
comment on column WALLET_HUB.WALLET_ID is 'Wallet business number';