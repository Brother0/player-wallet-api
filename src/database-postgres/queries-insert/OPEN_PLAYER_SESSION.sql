/*
    Opens a player session. Inserts data in the SESSION_HUB, SESSION_SAT and PLAYER_SESSION_LINK tables

    @ sessionId - Session Id
    @ recordSource - IP of the client address
    @ playerId - Player Id
*/
INSERT INTO SESSION_HUB VALUES(current_timestamp, ${recordSource}, ${sessionId});
INSERT INTO SESSION_SAT VALUES(md5(${sessionId}), current_timestamp, ${recordSource}, current_timestamp);
INSERT INTO PLAYER_SESSION_LINK VALUES(md5(concat(${playerId},${sessionId})), md5(${playerId}), md5(${sessionId}), current_timestamp, ${recordSource});
    