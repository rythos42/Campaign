USE Campaign;

CREATE TABLE CampaignFaction (
    Id INT NOT NULL AUTO_INCREMENT,
    Name varchar(255) NOT NULL,
    CampaignId INT NOT NULL,
    PRIMARY KEY (Id),
    FOREIGN KEY CampaignFaction_Campaign (CampaignId) REFERENCES Campaign(Id)
)