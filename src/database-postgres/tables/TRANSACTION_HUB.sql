CREATE TABLE TRANSACTION_HUB (
    LOAD_DATE TIMESTAMP NOT NULL,
    RECORD_SOURCE VARCHAR(50) NOT NULL,
    TRANSACTION_ID VARCHAR(50) NOT NULL,
    TRANSACTION_HKEY text GENERATED ALWAYS AS (md5(TRANSACTION_ID::bytea)) STORED,

    CONSTRAINT PK_TRANSACTION_HUB PRIMARY KEY  (
        TRANSACTION_HKEY
    ),
    CONSTRAINT UQ_TRANSACTION_LINK UNIQUE 
    (
        TRANSACTION_ID
    )
);

comment on table TRANSACTION_HUB is 'Transactions';
comment on column TRANSACTION_HUB.TRANSACTION_HKEY is 'Transaction hash key';
comment on column TRANSACTION_HUB.LOAD_DATE is 'Load time';
comment on column TRANSACTION_HUB.RECORD_SOURCE is 'Origin';
comment on column TRANSACTION_HUB.TRANSACTION_ID is 'Transaction business number';