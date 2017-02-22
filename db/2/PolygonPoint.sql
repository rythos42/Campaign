USE Campaign;

CREATE TABLE PolygonPoint (
    PolygonId BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    X INT NOT NULL,
    Y INT NOT NULL,
    FOREIGN KEY PolygonPoint_Polygon (PolygonId) REFERENCES Polygon(Id)
)