<?php
require_once Server::getFullPath() . '/lib/Nurbs/Voronoi.php';
require_once Server::getFullPath() . '/lib/Nurbs/Point.php';

class MapMapper {
    public static function getAdjacentTerritoriesForCampaign($campaignId) {
        // Get all polygon points, for all polygons that are adjacent to factions in the given campaign
        $dbAdjacentPolygonList = self::getAdjacentPolygonsForCampaign($campaignId);
        $dbPolygonList = array();
        foreach($dbAdjacentPolygonList as $dbAdjacentPolygon) {
            $dbPolygon = array();
            $dbPolygon["OwningFactionId"] = $dbAdjacentPolygon["OwningFactionId"];
            $dbPolygon["Id"] = $dbAdjacentPolygon["Id"];
            $dbPolygon["IdOnMap"] = $dbAdjacentPolygon["IdOnMap"];
            $dbPolygon["Points"] = Database::queryArray("select X, Y, PointNumber from PolygonPoint where PolygonId = ?", [$dbAdjacentPolygon["Id"]]);
            $dbPolygonList[] = $dbPolygon;
        }
            
        return $dbPolygonList;
    }
    
    private static function getAdjacentPolygonsForCampaign($campaignId) {
        // get all polygons adjacent (within -2 to +2 pixels) to factions in the given campaign
        return Database::queryArray(
            "select ownedPolygon.OwningFactionId, adjacentPolygon.Id, adjacentPolygon.IdOnMap
                from Polygon ownedPolygon
                join PolygonPoint ownedPoint on ownedPoint.PolygonId = ownedPolygon.Id
                join PolygonPoint adjacentPoint on 
                    (ownedPoint.X < adjacentPoint.X + 2 and ownedPoint.X > adjacentPoint.X - 2)
                    and (ownedPoint.Y < adjacentPoint.Y + 2 and ownedPoint.Y > adjacentPoint.Y - 2)
                    and ownedPoint.PolygonId <> adjacentPoint.PolygonId
                join Polygon adjacentPolygon on adjacentPolygon.Id = adjacentPoint.PolygonId
                join CampaignFaction on CampaignFaction.Id = ownedPolygon.OwningFactionId
                where CampaignFaction.CampaignId=?
                group by ownedPolygon.OwningFactionId, adjacentPolygon.Id", [$campaignId]);
    }
    
    private static function getPolygonListFromDatabasePolygonList($dbPolygonList) {
        $polygonList = array();
        foreach($dbPolygonList as $dbPolygon) {
            $polygonIdOnMap = $dbPolygon["IdOnMap"];
            if(!array_key_exists($polygonIdOnMap, $polygonList)) {
                $polygonList[$polygonIdOnMap] = array();
                
                if(array_key_exists("Colour", $dbPolygon))
                    $polygonList[$polygonIdOnMap]["Colour"] = $dbPolygon["Colour"];
                
                if(array_key_exists("OwningFactionId", $dbPolygon))
                    $polygonList[$polygonIdOnMap]["OwningFactionId"] = $dbPolygon["OwningFactionId"];
                
                $polygonList[$polygonIdOnMap]["Points"] = array();
            }
            
            $polygonList[$polygonIdOnMap]["Points"][] = $dbPolygon["X"];
            $polygonList[$polygonIdOnMap]["Points"][] = $dbPolygon["Y"];
        }
        
        return $polygonList;
    }
    
    public static function outputMapForCampaign($campaignId) {
        $width = 1024;
        $height = 768;
        $image = imagecreatetruecolor($width, $height);
        imagealphablending($image, true);
        imagesavealpha($image, true);
        
        $starmap = imagecreatefromjpeg(Server::getFullPath() . "/img/stars_pink_light_galaxy_1471_1024x768.jpg");
        imagecopy($image, $starmap, 0, 0, 0, 0, $width, $height);
                    
        $sectorImage = imagecreatefrompng(MapMapper::getMapFileNameForCampaign($campaignId));
        imagecopy($image, $sectorImage, 0, 0, 0, 0, $width, $height);
               
        $dbPolygonList = Database::queryArray(
            "select IdOnMap, CampaignFaction.Colour, PolygonPoint.X, PolygonPoint.Y 
            from Polygon 
            join PolygonPoint on PolygonPoint.PolygonId = Polygon.Id
            left join CampaignFaction on CampaignFaction.Id = Polygon.OwningFactionId
            where Polygon.CampaignId=?", 
            [$campaignId]);
        
        foreach(self::getPolygonListFromDatabasePolygonList($dbPolygonList) as $polygon) {
            // skip unwanted polygons
            if(!array_key_exists("Colour", $polygon) || $polygon["Colour"] === null)
                continue;

            list($red, $green, $blue) = sscanf($polygon["Colour"], "%02x%02x%02x");
            $colour = imagecolorallocatealpha($image, $red, $green, $blue, 80);
            imagefilledpolygon($image, $polygon["Points"], count($polygon["Points"]) / 2, $colour);
        }
        
        imagepng($image);
    }
    
    public static function getMapFileNameForCampaign($campaignId) {
        $installDirOnWebServer = Server::getFullPath();
        return "$installDirOnWebServer/img/maps/$campaignId.png";
    }
    
    public static function generateAndSaveMapForId($campaignId) {
        $bbox = new stdClass();
        $bbox->xl = 0;
        $bbox->xr = 1024;
        $bbox->yt = 0;
        $bbox->yb = 768;

        $n = 50;
        $fontSize = 14;

        // Generate random points
        $sites = array();
        for ($i=0; $i < $n; $i++) {
            $sites[] = new Nurbs_Point(rand($bbox->xl, $bbox->xr), rand($bbox->yt, $bbox->yb));
        }

        $voronoi = new Voronoi();
        $diagram = $voronoi->compute($sites, $bbox);

        $map = imagecreatetruecolor($bbox->xr, $bbox->yb);
        imagesavealpha($map, true);

        $background = imagecolorallocatealpha($map, 255, 255, 255, 127);
        imagefill($map, 0, 0, $background);

        $lineShadow = imagecolorallocate($map, 0, 0, 0);
        $lineColor = imagecolorallocate($map, 250, 250, 250);
        $areaNumber = 0;
        foreach ($diagram['cells'] as $cell) {
            $points = MapMapper::getPolygonPoints($cell);

            // draw the sectors
            imagesetthickness($map, 3);
            imagepolygon($map, $points->points, $points->count, $lineShadow);
            imagesetthickness($map, 1);
            imagepolygon($map, $points->points, $points->count, $lineColor);
            
            // Center the text inside the center of the polygon
            $center = MapMapper::getCenter($points->pointsForCenterCalculation);
            $textBoundingBox = imagettfbbox($fontSize, 0, 'arial.ttf', $areaNumber + 1);
            imagettftext($map, $fontSize, 0, $center->x - ($textBoundingBox[0] / 2), $center->y - ($textBoundingBox[1] / 2), $lineShadow, 'arial.ttf', $areaNumber + 1);
            imagettftext($map, $fontSize - 2, 0, $center->x - ($textBoundingBox[0] / 2), $center->y - ($textBoundingBox[1] / 2), $lineColor, 'arial.ttf', $areaNumber + 1);
            
            Database::execute("INSERT INTO Polygon (CampaignId, IdOnMap) VALUES (?, ?)", [$campaignId, $areaNumber + 1]);
            $polygonId = Database::getLastInsertedId();
            $pointNumber = 0;
            foreach($points->pointsForCenterCalculation as $pointToSave) {
                Database::execute("INSERT INTO PolygonPoint (PolygonId, X, Y, PointNumber) VALUES (?, ?, ?, ?)", [$polygonId, $pointToSave->x, $pointToSave->y, $pointNumber]);
                $pointNumber++;
            }
            
            $areaNumber++;
        }

        imagepng($map, MapMapper::getMapFileNameForCampaign($campaignId));
    }
    
    private static function getPolygonPoints($cell) {
        $points = array();
        $pointsForCenterCalculation = array();

        if (count($cell->_halfedges) > 0) {
            $v = $cell->_halfedges[0]->getStartPoint();
            if ($v) {
                $pointsForCenterCalculation[] = (object) ['x' => $v->x, 'y' => $v->y];
                $points[] = $v->x;
                $points[] = $v->y;
            } else {
                var_dump($areaNumber . ': no start point');
            }

            for ($i = 0; $i < count($cell->_halfedges); $i++) {
                $halfedge = $cell->_halfedges[$i];
                $v = $halfedge->getEndPoint();
                if ($v) {
                    $pointsForCenterCalculation[] = (object) ['x' => $v->x, 'y' => $v->y];
                    $points[] = $v->x;
                    $points[] = $v->y;
                }
            }
        }

        return (object) ['points' => $points, 'pointsForCenterCalculation' => $pointsForCenterCalculation, 'count' => count($points) / 2];
    }
    
    private static function getCenter($polygon) { 
        $NumPoints = count($polygon);
        if($polygon[$NumPoints-1] == $polygon[0])
            $NumPoints--;
        else
            $polygon[$NumPoints] = $polygon[0];

        $x = 0;
        $y = 0;
        for($pt = 0; $pt<= $NumPoints-1; $pt++) {
            $factor = $polygon[$pt]->x * $polygon[$pt + 1]->y - $polygon[$pt + 1]->x * $polygon[$pt]->y;
            $x += ($polygon[$pt]->x + $polygon[$pt + 1]->x) * $factor;
            $y += ($polygon[$pt]->y + $polygon[$pt + 1]->y) * $factor;
        }

        // Divide by 6 times the polygon's area.
        $polygon_area = 0;
        for( $i = 0; $i <= $NumPoints; ++$i ) {
            $xValue = array_key_exists($i, $polygon) ? $polygon[$i]->x : 0;
            $yPlus1Value = array_key_exists($i+1, $polygon) ? $polygon[$i+1]->y : 0;
            $yMinus1Value = array_key_exists($i-1, $polygon) ? $polygon[$i-1]->y : 0;
            
            $polygon_area += $xValue * ( $yPlus1Value - $yMinus1Value );
        }
        $polygon_area /= 2;

        return (object) ['x' => $x / 6 / $polygon_area, 'y' => $y / 6 / $polygon_area];
    }
}
?>