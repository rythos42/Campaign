USE Campaign;

CREATE TABLE Polygon (
    Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    CampaignId INT NOT NULL,
    IdOnMap INT NOT NULL,
    OwningFactionId INT,
    PRIMARY KEY (Id),
    FOREIGN KEY Polygon_Campaign (CampaignId) REFERENCES Campaign(Id),
    FOREIGN KEY Polygon_CampaignFaction (OwningFactionId) REFERENCES CampaignFaction(Id)
)