/*
    Gets players wallet
*/
SELECT wallet_id,
       opening_balance,
       currency_code,
       player_id,
       first_name,
       last_name,
       wallet_hub.record_source,
       wallet_hub.load_date
FROM   wallet_hub
       INNER JOIN wallet_sat_latest
               ON wallet_hub.wallet_hkey = wallet_sat_latest.wallet_hkey
       INNER JOIN player_wallet_link
               ON player_wallet_link.wallet_hkey = wallet_hub.wallet_hkey
       INNER JOIN player_hub
               ON player_hub.player_hkey = player_wallet_link.player_hkey
       INNER JOIN player_sat
               ON player_sat.player_hkey = player_hub.player_hkey 
WHERE (${playerId} IS NULL or player_id=${playerId}) AND
(${walletId} IS NULL or wallet_id=${walletId}) AND
(${currencyCode} IS NULL or currency_code=${currencyCode}) AND
(${firstName} IS NULL or first_name=${firstName}) AND
(${lastName} IS NULL or last_name=${lastName})