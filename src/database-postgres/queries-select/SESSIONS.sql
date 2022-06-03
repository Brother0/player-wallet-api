/*
    Get Information about player sessions
*/
SELECT session_id,
       session_start_date,
       player_id,
       first_name,
       last_name,
       session_sat_latest.load_date,
       session_sat_latest.record_source
FROM   player_hub
       INNER JOIN player_session_link
               ON player_session_link.player_hkey = player_hub.player_hkey
       INNER JOIN player_sat_latest
               ON player_sat_latest.player_hkey = player_hub.player_hkey
       INNER JOIN session_hub
               ON session_hub.session_hkey = player_session_link.session_hkey
       INNER JOIN session_sat_latest
               ON session_hub.session_hkey = session_sat_latest.session_hkey  
WHERE
    (${playerId} IS NULL or player_id=${playerId}) AND
    (${sessionId} IS NULL or session_id=${sessionId}) AND
    (${firstName} IS NULL or first_name=${firstName}) AND
    (${lastName} IS NULL or last_name=${lastName})
