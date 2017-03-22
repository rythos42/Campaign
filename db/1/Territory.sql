USE Campaign;

CREATE TABLE Territory (
    Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    CampaignId INT NOT NULL,
    IdOnMap INT NOT NULL,
    OwningFactionId INT,
    PRIMARY KEY (Id),
    FOREIGN KEY Territory_Campaign (CampaignId) REFERENCES Campaign(Id),
    FOREIGN KEY Territory_Faction (OwningFactionId) REFERENCES Faction(Id)
) 