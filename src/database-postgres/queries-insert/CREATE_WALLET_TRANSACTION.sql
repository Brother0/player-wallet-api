/*
    Creates a wallet transaction. Inserts data in the TRANSACTION_HUB, TRANSACTION_SAT and WALLET_TRANSACTION_LINK tables.
    Also based on current player session (API parameter) we update the SESSION_TRANSACTION_LINK

    @ transactionId - Transaction Id
    @ recordSource - IP of the client address
    @ walletId - Wallet Id
    @ sessionId - Session Id

    @ amount - Transaction amount
    @ openingBalance - Opening balance of the transaction
    @ closingBalance - Closing balance of the transaction
    @ transactionType - Type of transaction

*/
INSERT INTO TRANSACTION_HUB VALUES(current_timestamp, ${recordSource}, ${transactionId});
INSERT INTO TRANSACTION_SAT VALUES(md5(${transactionId}), current_timestamp, ${recordSource}, current_timestamp,${amount},${openingBalance},${closingBalance},${transactionType});
INSERT INTO WALLET_TRANSACTION_LINK VALUES(md5(concat(${walletId},${transactionId})), md5(${walletId}), md5(${transactionId}), current_timestamp, ${recordSource});
INSERT INTO SESSION_TRANSACTION_LINK VALUES(md5(concat(${sessionId},${transactionId})), md5(${sessionId}), md5(${transactionId}), current_timestamp, ${recordSource});
