USE Campaign;

CREATE TABLE Campaign (
    Id INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    FactionCount INT NOT NULL,
    CreatedByUserId INT NOT NULL,
    CreatedOnDate datetime NOT NULL,
    PRIMARY KEY (Id),
    FOREIGN KEY Campaign_User (CreatedByUserId) REFERENCES User(Id)
)