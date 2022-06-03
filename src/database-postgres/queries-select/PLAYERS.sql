/*
    Get players from system
*/
SELECT player_id,
       first_name,
       last_name,
       player_sat.load_date,
       player_sat.record_source
FROM   player_hub
       INNER JOIN player_sat
               ON player_hub.player_hkey = player_sat.player_hkey 
WHERE (${playerId} IS NULL or player_id=${playerId}) AND
    (${firstName} IS NULL or first_name=${firstName}) AND
    (${lastName} IS NULL or last_name=${lastName})
