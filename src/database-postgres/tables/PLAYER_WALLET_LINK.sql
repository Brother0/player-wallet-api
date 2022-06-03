CREATE TABLE PLAYER_WALLET_LINK (
    PLAYER_WALLET_HKEY text NOT NULL,
    PLAYER_HKEY text NOT NULL,
    WALLET_HKEY text NOT NULL,
    LOAD_DATE TIMESTAMP NOT NULL,
    RECORD_SOURCE VARCHAR(50) NOT NULL,

    CONSTRAINT PK_PLAYER_WALLET_LINK PRIMARY KEY  (
        PLAYER_WALLET_HKEY
    ),

    CONSTRAINT UQ_PLAYER_WALLET_LINK UNIQUE 
    (
        PLAYER_HKEY,
        WALLET_HKEY
    )

);

comment on table PLAYER_WALLET_LINK is 'Link between players and wallets';
comment on column PLAYER_WALLET_LINK.PLAYER_WALLET_HKEY is 'Player wallet link key';
comment on column PLAYER_WALLET_LINK.PLAYER_HKEY is 'Player hkey';
comment on column PLAYER_WALLET_LINK.WALLET_HKEY is 'Wallet hkey';
comment on column PLAYER_WALLET_LINK.LOAD_DATE is 'Load time';
comment on column PLAYER_WALLET_LINK.RECORD_SOURCE is 'Origin';
