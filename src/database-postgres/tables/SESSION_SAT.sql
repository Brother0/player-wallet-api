CREATE TABLE SESSION_SAT (
    SESSION_HKEY text NOT NULL,
    LOAD_DATE TIMESTAMP NOT NULL,
    RECORD_SOURCE VARCHAR(50) NOT NULL,
    SESSION_START_DATE TIMESTAMP NOT NULL,

    CONSTRAINT PK_SESSION_SAT PRIMARY KEY  (
        SESSION_HKEY,
        LOAD_DATE
    )
);

comment on table SESSION_SAT is 'Additional attributes of a session';
comment on column SESSION_SAT.SESSION_HKEY is 'Session hash key';
comment on column SESSION_SAT.LOAD_DATE is 'Load time';
comment on column SESSION_SAT.RECORD_SOURCE is 'Origin';
comment on column SESSION_SAT.SESSION_START_DATE is 'Session start date';

-- used to get latest session data
CREATE VIEW SESSION_SAT_LATEST AS
    SELECT SESSION_SAT.* FROM SESSION_SAT
    INNER JOIN
    (
        SELECT SESSION_HKEY, MAX(LOAD_DATE) from SESSION_SAT
        GROUP BY SESSION_HKEY
    ) LATEST_SESSION_LOAD
    ON SESSION_SAT.SESSION_HKEY = LATEST_SESSION_LOAD.SESSION_HKEY
