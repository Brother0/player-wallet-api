/*
    Transactions
*/
SELECT player_hub.player_id,
       player_sat_latest.first_name,
       player_sat_latest.last_name,
       session_hub.session_id,
       transaction_hub.transaction_id,
       transaction_sat.amount,
       transaction_sat.closing_balance,
       transaction_sat.opening_balance,
       wallet_sat_latest.currency_code,
       wallet_hub.wallet_id,
       transaction_sat.transaction_type,
       transaction_sat.transaction_date,
       transaction_sat.load_date
FROM   transaction_hub
       INNER JOIN transaction_sat
               ON transaction_hub.transaction_hkey =
                  transaction_sat.transaction_hkey
       INNER JOIN wallet_transaction_link
               ON transaction_hub.transaction_hkey =
                  wallet_transaction_link.transaction_hkey
       INNER JOIN wallet_hub
               ON wallet_transaction_link.wallet_hkey =
                  wallet_hub.wallet_hkey
       INNER JOIN wallet_sat_latest
               ON wallet_sat_latest.wallet_hkey =
                  wallet_transaction_link.wallet_hkey
       INNER JOIN player_wallet_link
               ON player_wallet_link.wallet_hkey =
                  wallet_transaction_link.wallet_hkey
       INNER JOIN player_hub
               ON player_hub.player_hkey = player_wallet_link.player_hkey
       INNER JOIN player_sat_latest
               ON player_sat_latest.player_hkey = player_hub.player_hkey
       INNER JOIN session_transaction_link
               ON session_transaction_link.transaction_hkey =
                  transaction_hub.transaction_hkey
       INNER JOIN session_hub
               ON session_hub.session_hkey =
                  session_transaction_link.session_hkey 
WHERE
    (${playerId} IS NULL or player_id=${playerId}) AND
    (${firstName} IS NULL or first_name=${firstName}) AND
    (${lastName} IS NULL or last_name=${lastName}) AND
    (${transactionId} IS NULL or transaction_id=${transactionId}) AND
    (${transactionType} IS NULL or transaction_type=${transactionType}) AND
    (${currencyCode} IS NULL or currency_code=${currencyCode}) AND
    (${sessionId} IS NULL or session_id=${sessionId}) AND
    (${walletId} IS NULL or wallet_id=${walletId})
ORDER BY
        transaction_sat.transaction_number ASC