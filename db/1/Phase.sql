USE Campaign;

CREATE TABLE Phase (
    Id INT NOT NULL AUTO_INCREMENT,
    CampaignId INT NOT NULL,
    StartDate DATETIME NOT NULL,
    PRIMARY KEY (Id),
    FOREIGN KEY Phase_Campaign (CampaignId) REFERENCES Campaign(Id)
)