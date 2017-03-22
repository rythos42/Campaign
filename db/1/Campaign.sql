USE Campaign;
 
CREATE TABLE Campaign (
    Id INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    CreatedByUserId INT NOT NULL,
    CreatedOnDate datetime NOT NULL,
    CampaignType INT DEFAULT 0,
    MandatoryAttacks INT DEFAULT 1,
    OptionalAttacks INT DEFAULT 2,
    PRIMARY KEY (Id),
    FOREIGN KEY Campaign_User (CreatedByUserId) REFERENCES User(Id)
) 