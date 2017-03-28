USE Campaign;
 
CREATE TABLE News (
    Id INT NOT NULL AUTO_INCREMENT,
    News TEXT,
    CampaignId INT,
    EntryId INT,
    CreatedByUserId INT,
    CreatedOnDate datetime,
    PRIMARY KEY (Id),
    FOREIGN KEY News_Campaign (CampaignId) REFERENCES Campaign(Id),
    FOREIGN KEY News_Entry (EntryId) REFERENCES Entry(Id),
    FOREIGN KEY News_User (CreatedByUserId) REFERENCES User(Id)
); 