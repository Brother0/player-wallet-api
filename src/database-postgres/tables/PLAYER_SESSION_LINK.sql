CREATE TABLE PLAYER_SESSION_LINK (
    PLAYER_SESSION_HKEY text NOT NULL,
    PLAYER_HKEY text NOT NULL,
    SESSION_HKEY text NOT NULL,
    LOAD_DATE TIMESTAMP NOT NULL,
    RECORD_SOURCE VARCHAR(50) NOT NULL,

    CONSTRAINT PK_PLAYER_SESSION_LINK PRIMARY KEY  (
        PLAYER_SESSION_HKEY
    ),

    CONSTRAINT UQ_PLAYER_SESSION_LINK UNIQUE 
    (
        PLAYER_HKEY,
        SESSION_HKEY
    )

);

comment on table PLAYER_SESSION_LINK is 'Link between players and sessions';
comment on column PLAYER_SESSION_LINK.PLAYER_SESSION_HKEY is 'Player session link key';
comment on column PLAYER_SESSION_LINK.PLAYER_HKEY is 'Player hkey';
comment on column PLAYER_SESSION_LINK.SESSION_HKEY is 'Session hkey';
comment on column PLAYER_SESSION_LINK.LOAD_DATE is 'Load time';
comment on column PLAYER_SESSION_LINK.RECORD_SOURCE is 'Origin';