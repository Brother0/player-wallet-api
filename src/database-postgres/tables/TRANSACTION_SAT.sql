CREATE TABLE TRANSACTION_SAT (
    TRANSACTION_HKEY CHAR(32) NOT NULL,
    LOAD_DATE TIMESTAMP NOT NULL,
    RECORD_SOURCE VARCHAR(50) NOT NULL,
    TRANSACTION_DATE TIMESTAMP NOT NULL, 
    AMOUNT NUMERIC(15, 2) NOT NULL,
    OPENING_BALANCE NUMERIC(15, 2) NOT NULL,
    CLOSING_BALANCE NUMERIC(15, 2) NOT NULL,
    TRANSACTION_TYPE VARCHAR(250) NOT NULL,
    TRANSACTION_NUMBER SERIAL,

    CONSTRAINT PK_TRANSACTION_SAT PRIMARY KEY  (
        TRANSACTION_HKEY,
        LOAD_DATE
    )
);


comment on table TRANSACTION_SAT is 'Additional attributes of a transaction';
comment on column TRANSACTION_SAT.TRANSACTION_HKEY is 'Transaction hash key';
comment on column TRANSACTION_SAT.LOAD_DATE is 'Load time';
comment on column TRANSACTION_SAT.TRANSACTION_NUMBER is 'Sequential number of a transaction';
comment on column TRANSACTION_SAT.TRANSACTION_DATE is 'Transaction date';
comment on column TRANSACTION_SAT.AMOUNT is 'Transaction amount';
comment on column TRANSACTION_SAT.OPENING_BALANCE is 'Opening balance';
comment on column TRANSACTION_SAT.CLOSING_BALANCE is 'Closing balance';
comment on column TRANSACTION_SAT.TRANSACTION_TYPE is 'Transaction type';
comment on column TRANSACTION_SAT.RECORD_SOURCE is 'Origin';