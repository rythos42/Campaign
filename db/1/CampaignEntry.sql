USE Campaign;

CREATE TABLE CampaignEntry (
    Id INT NOT NULL AUTO_INCREMENT,
    CampaignId INT NOT NULL,
    CreatedByUserId INT NOT NULL,
    CreatedOnDate datetime NOT NULL,
    PRIMARY KEY (Id),
    FOREIGN KEY CampaignEntry_User (CreatedByUserId) REFERENCES User(Id),
    FOREIGN KEY CampaignEntry_Campaign (CampaignId) REFERENCES Campaign(Id)
)