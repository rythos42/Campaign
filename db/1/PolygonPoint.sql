USE Campaign;

CREATE TABLE PolygonPoint1 (
    PolygonId BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    X INT NOT NULL,
    Y INT NOT NULL,
    PointNumber INT NOT NULL,
    FOREIGN KEY PolygonPoint_Polygon (PolygonId) REFERENCES Polygon(Id),
    INDEX X_Index (X),
    INDEX Y_Index (Y)
)