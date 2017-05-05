USE Campaign;

CREATE TABLE Entry (
    Id INT NOT NULL AUTO_INCREMENT,
    CampaignId INT NOT NULL,
    CreatedByUserId INT NOT NULL,
    CreatedOnDate datetime NOT NULL,
    AttackingUserId INT,
    FinishDate datetime,
    TerritoryBeingAttackedIdOnMap int,
    PRIMARY KEY (Id),
    FOREIGN KEY Entry_User (CreatedByUserId) REFERENCES User(Id),
    FOREIGN KEY Entry_Campaign (CampaignId) REFERENCES Campaign(Id),
    INDEX TerritoryBeingAttackedIdOnMap_Index (TerritoryBeingAttackedIdOnMap)
) 