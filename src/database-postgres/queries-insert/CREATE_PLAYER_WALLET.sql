/*
    Creates a player wallet. Inserts data in the WALLET_HUB, WALLET_SAT and PLAYER_WALLET_LINK tables.

    @ walletId - Wallet Id
    @ recordSource - IP of the client address
    @ openingBalance - Opening wallet balance
    @ currencyCode - Currency code of the new wallet
    @ playerId - Id of the player for which we are creating the new wallet
*/
INSERT INTO WALLET_HUB VALUES(current_timestamp, ${recordSource}, ${walletId});
INSERT INTO WALLET_SAT VALUES(md5(${walletId}), current_timestamp, ${recordSource}, ${openingBalance}, ${currencyCode});
INSERT INTO PLAYER_WALLET_LINK VALUES(md5(concat(${playerId},${walletId})), md5(${playerId}), md5(${walletId}), current_timestamp, ${recordSource});


