USE Campaign;

CREATE TABLE Faction (
    Id INT NOT NULL AUTO_INCREMENT,
    Name varchar(255) NOT NULL,
    CampaignId INT NOT NULL,
    Colour CHAR(9),
    PRIMARY KEY (Id),
    FOREIGN KEY Faction_Campaign (CampaignId) REFERENCES Campaign(Id)
) 