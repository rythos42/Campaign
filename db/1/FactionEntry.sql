USE Campaign;
 
CREATE TABLE FactionEntry (
    Id INT NOT NULL AUTO_INCREMENT,
    EntryId INT NOT NULL,
    FactionId INT NOT NULL,
    UserId INT NOT NULL,
    VictoryPointsScored int,
    TerritoryBonusSpent int,
    PRIMARY KEY (Id),
    FOREIGN KEY FactionEntry_Entry (EntryId) REFERENCES Entry(Id),
    FOREIGN KEY FactionEntry_Faction (FactionId) REFERENCES Faction(Id),
    FOREIGN KEY FactionEntry_User (UserId) REFERENCES User(Id)
) 