USE Campaign;

CREATE TABLE TerritoryPoint (
    TerritoryId BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    X INT NOT NULL,
    Y INT NOT NULL,
    PointNumber INT NOT NULL,
    FOREIGN KEY TerritoryPoint_Territory (TerritoryId) REFERENCES Territory(Id),
    INDEX X_Index (X),
    INDEX Y_Index (Y)
) 