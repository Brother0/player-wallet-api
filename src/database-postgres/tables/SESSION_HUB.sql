CREATE TABLE SESSION_HUB (
    LOAD_DATE TIMESTAMP NOT NULL,
    RECORD_SOURCE VARCHAR(50) NOT NULL,
    SESSION_ID VARCHAR(50) NOT NULL,
    SESSION_HKEY text GENERATED ALWAYS AS (md5(SESSION_ID::bytea)) STORED,

    CONSTRAINT PK_SESSION_HUB PRIMARY KEY  (
        SESSION_HKEY
    ),
    CONSTRAINT UQ_SESSION_LINK UNIQUE 
    (
        SESSION_ID
    )
);

comment on table SESSION_HUB is 'Sessions';
comment on column SESSION_HUB.SESSION_HKEY is 'Session hash key';
comment on column SESSION_HUB.LOAD_DATE is 'Load time';
comment on column SESSION_HUB.RECORD_SOURCE is 'Origin';
comment on column SESSION_HUB.SESSION_ID is 'Session business number';