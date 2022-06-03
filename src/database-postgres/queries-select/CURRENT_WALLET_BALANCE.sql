/*
    Current wallet balance
*/
SELECT wallet_id,
       player_id,
       first_name,
       last_name,
       wallet_sat_latest.currency_code,
       amount,
       transaction_sat.opening_balance,
       closing_balance
FROM   wallet_hub
       INNER JOIN wallet_transaction_link
               ON wallet_transaction_link.wallet_hkey = wallet_hub.wallet_hkey
       INNER JOIN transaction_sat
               ON transaction_sat.transaction_hkey =
                  wallet_transaction_link.transaction_hkey
       INNER JOIN wallet_sat_latest
               ON wallet_sat_latest.wallet_hkey = wallet_hub.wallet_hkey
       INNER JOIN player_wallet_link
               ON player_wallet_link.wallet_hkey = wallet_hub.wallet_hkey
       INNER JOIN player_hub
               ON player_hub.player_hkey = player_wallet_link.player_hkey
       INNER JOIN player_sat_latest
               ON player_sat_latest.player_hkey = player_hub.player_hkey
       INNER JOIN (SELECT wallet_hub.wallet_hkey,
                          Max(transaction_number) AS transaction_number
                   FROM   wallet_hub
                          INNER JOIN wallet_transaction_link
                                  ON wallet_transaction_link.wallet_hkey =
                                     wallet_hub.wallet_hkey
                          INNER JOIN transaction_sat
                                  ON transaction_sat.transaction_hkey =
                                     wallet_transaction_link.transaction_hkey
                   GROUP  BY wallet_hub.wallet_hkey) latest_transaction
               ON latest_transaction.transaction_number =
                  transaction_sat.transaction_number
WHERE
    (${playerId} IS NULL or player_hub.player_id=${playerId}) AND
    (${walletId} IS NULL or wallet_hub.wallet_id=${walletId}) AND
    (${currencyCode} IS NULL or wallet_sat_latest.currency_code=${currencyCode}) AND
    (${firstName} IS NULL or player_sat_latest.first_name=${firstName}) AND
    (${lastName} IS NULL or player_sat_latest.last_name=${lastName})
