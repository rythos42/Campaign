USE Campaign;

CREATE TABLE PermissionGroup (
    Id INT NOT NULL AUTO_INCREMENT,
    PermissionId INT NOT NULL,
    UserId INT NOT NULL,
    PRIMARY KEY (Id),
    FOREIGN KEY PermissionGroup_Permission (PermissionId) REFERENCES Permission(Id),
    FOREIGN KEY PermissionGroup_User (UserId) REFERENCES User(Id)
)