USE Campaign;
 
CREATE TABLE User (
    Id INT NOT NULL AUTO_INCREMENT,
    Username VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedOnDate datetime NOT NULL,
    LastLoginDate datetime,
    Email VARCHAR(320),
    OneSignalUserId CHAR(36),
    PRIMARY KEY (Id)
); 