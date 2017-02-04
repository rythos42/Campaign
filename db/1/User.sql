USE Campaign;

CREATE TABLE User (
    Id INT NOT NULL AUTO_INCREMENT,
    Username VARCHAR(255) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedOnDate datetime NOT NULL,
    PRIMARY KEY (Id)
)