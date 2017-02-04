USE Campaign;

CREATE TABLE CampaignFactionEntry (
    Id INT NOT NULL AUTO_INCREMENT,
    CampaignEntryId INT NOT NULL,
    CampaignFactionId INT NOT NULL,
    UserId INT NOT NULL,
    VictoryPointsScored INT NOT NULL,
    PRIMARY KEY (Id),
    FOREIGN KEY CampaignFactionEntry_CampaignEntry (CampaignEntryId) REFERENCES CampaignEntry(Id),
    FOREIGN KEY CampaignFactionEntry_CampaignFaction (CampaignFactionId) REFERENCES CampaignFaction(Id),
    FOREIGN KEY CampaignFactionEntry_User (UserId) REFERENCES User(Id)
)