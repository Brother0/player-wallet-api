CREATE TABLE PLAYER_SAT (
    PLAYER_HKEY text NOT NULL,
    LOAD_DATE TIMESTAMP NOT NULL,
    RECORD_SOURCE VARCHAR(50) NOT NULL,
    FIRST_NAME VARCHAR(250) NULL,
    LAST_NAME VARCHAR(250) NULL,

    CONSTRAINT PK_PLAYER_SAT PRIMARY KEY  (
        PLAYER_HKEY,
        LOAD_DATE
    )
);

comment on table PLAYER_SAT is 'Additional attributes of players';
comment on column PLAYER_SAT.PLAYER_HKEY is 'Player hash key';
comment on column PLAYER_SAT.LOAD_DATE is 'Load time';
comment on column PLAYER_SAT.RECORD_SOURCE is 'Origin';
comment on column PLAYER_SAT.FIRST_NAME is 'First name';
comment on column PLAYER_SAT.LAST_NAME is 'Last name';

-- used to get latest player data
CREATE VIEW PLAYER_SAT_LATEST AS
    SELECT PLAYER_SAT.* FROM PLAYER_SAT
    INNER JOIN
    (
        SELECT PLAYER_HKEY, MAX(LOAD_DATE) from PLAYER_SAT
        GROUP BY PLAYER_HKEY
    ) LATEST_PLAYER_LOAD
    ON PLAYER_SAT.PLAYER_HKEY = LATEST_PLAYER_LOAD.PLAYER_HKEY
