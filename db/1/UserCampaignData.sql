USE Campaign;

CREATE TABLE UserCampaignData (
    Id INT NOT NULL AUTO_INCREMENT,
    CampaignId INT NOT NULL,
    UserId INT NOT NULL,
    TerritoryBonus INT DEFAULT 0,
    Attacks INT DEFAULT 0,
    FactionId INT,
    PRIMARY KEY (Id),
    FOREIGN KEY UserCampaignData_Campaign (CampaignId) REFERENCES Campaign(Id),
    FOREIGN KEY UserCampaignData_User (UserId) REFERENCES User(Id)
    FOREIGN KEY UserCampaignData_Faction (FactionId) REFERENCES Faction(Id)
) 