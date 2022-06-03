CREATE TABLE PLAYER_HUB (
    LOAD_DATE TIMESTAMP NOT NULL,
    RECORD_SOURCE VARCHAR(50) NOT NULL,
    PLAYER_ID VARCHAR(50) NOT NULL,
    PLAYER_HKEY text GENERATED ALWAYS AS (md5(PLAYER_ID::bytea)) STORED,

    CONSTRAINT PK_PLAYER_HUB PRIMARY KEY  (
        PLAYER_HKEY
    ),
    CONSTRAINT UQ_PLAYER_LINK UNIQUE 
    (
        PLAYER_ID
    )
);

comment on table PLAYER_HUB is 'Players';
comment on column PLAYER_HUB.PLAYER_HKEY is 'Player hash key';
comment on column PLAYER_HUB.LOAD_DATE is 'Load time';
comment on column PLAYER_HUB.RECORD_SOURCE is 'Origin';
comment on column PLAYER_HUB.PLAYER_ID is 'Player business number';