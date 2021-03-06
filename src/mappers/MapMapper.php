<?php
require_once Server::getFullPath() . '/lib/Nurbs/Voronoi.php';
require_once Server::getFullPath() . '/lib/Nurbs/Point.php';

class MapMapper {
    public static function updateTags($territoryId, $newTags) {
        Database::execute("update Territory set Tags = ? where Id = ?", [$newTags, $territoryId]); 
    }
    
    public static function saveCampaignTerritories($factionTerritories, $territoryTags) {
        foreach($factionTerritories as $territoryId => $factionId) {
            Database::execute("update Territory set OwningFactionId = ? where Id = ?", [$factionId, $territoryId]); 
        }

        foreach($territoryTags as $territoryId => $tags) {
            Database::execute("update Territory set Tags = ? where Id = ?", [$tags, $territoryId]); 
        }
    }
    
    public static function getAdjacentTerritoriesForFaction($factionId) {
        $dbAdjacentTerritoryList = self::getAdjacentPolygonsForFaction($factionId);
        return MapMapper::getTerritoryPointsListFromTerritoryList($dbAdjacentTerritoryList);
    }
    
    public static function getAllTerritoriesForCampaign($campaignId) {
        $dbTerritoryListForCampaign = Database::queryArray(
            "select Territory.Id, Territory.IdOnMap, Territory.OwningFactionId, Tags,
            Entry.AttackingUserId, User.Username, UserCampaignData.FactionId as AttackingFactionId, Faction.Name as FactionName
            from Territory
            left join Faction on Faction.Id = Territory.OwningFactionId
            left join Entry on 
                Entry.TerritoryBeingAttackedIdOnMap = Territory.IdOnMap 
                and Entry.CampaignId = Territory.CampaignId
                and Entry.FinishDate is null
            left join User on User.Id = Entry.AttackingUserId
            left join UserCampaignData on UserCampaignData.UserId = User.Id and UserCampaignData.CampaignId = Territory.CampaignId
            where Territory.CampaignId = ?", [$campaignId]);
        return MapMapper::getTerritoryPointsListFromTerritoryList($dbTerritoryListForCampaign);
    }
    
    private static function getTerritoryPointsListFromTerritoryList($dbTerritoryList) {
        $returnTerritoryList = array();
        foreach($dbTerritoryList as $dbTerritory) {
            $returnTerritory = array();
            $returnTerritory["Id"] = $dbTerritory["Id"];
            $returnTerritory["IdOnMap"] = $dbTerritory["IdOnMap"];
            $returnTerritory["Tags"] = $dbTerritory["Tags"];
            $returnTerritory["OwningFactionId"] = $dbTerritory["OwningFactionId"];
            $returnTerritory["AttackingUserId"] = $dbTerritory["AttackingUserId"];
            $returnTerritory["AttackingUsername"] = $dbTerritory["Username"];
            $returnTerritory["AttackingFactionId"] = $dbTerritory["AttackingFactionId"];
            $returnTerritory["AttackingFactionName"] = $dbTerritory["FactionName"];
            $returnTerritory["Points"] = Database::queryArray("select X, Y, PointNumber from TerritoryPoint where TerritoryId = ?", [$dbTerritory["Id"]]);
            $returnTerritoryList[] = $returnTerritory;
        }
        return $returnTerritoryList;
    }
    
    private static function getAdjacentPolygonsForFaction($factionId) {
        // get all polygons adjacent (within -2 to +2 pixels) to the given faction
        return Database::queryArray(
            "select adjacentPolygon.Id, adjacentPolygon.IdOnMap, adjacentPolygon.OwningFactionId, adjacentPolygon.Tags,
                    Entry.AttackingUserId, User.Username, UserCampaignData.FactionId as AttackingFactionId, Faction.Name as FactionName
                from Territory ownedPolygon
                left join Faction on Faction.Id = ownedPolygon.OwningFactionId
                join TerritoryPoint ownedPoint on ownedPoint.TerritoryId = ownedPolygon.Id
                join TerritoryPoint adjacentPoint on 
                    (ownedPoint.X < adjacentPoint.X + 2 and ownedPoint.X > adjacentPoint.X - 2)
                    and (ownedPoint.Y < adjacentPoint.Y + 2 and ownedPoint.Y > adjacentPoint.Y - 2)
                    and ownedPoint.TerritoryId <> adjacentPoint.TerritoryId
                join Territory adjacentPolygon on 
                    adjacentPolygon.Id = adjacentPoint.TerritoryId 
                    and ifnull(adjacentPolygon.OwningFactionId, -1) <> ifnull(ownedPolygon.OwningFactionId, -1)
                    and adjacentPolygon.CampaignId = ownedPolygon.CampaignId
                left join Entry on 
                    Entry.TerritoryBeingAttackedIdOnMap = ownedPolygon.IdOnMap 
                    and Entry.CampaignId = ownedPolygon.CampaignId
                left join User on User.Id = Entry.AttackingUserId
                left join UserCampaignData on UserCampaignData.UserId = User.Id
                where ownedPolygon.OwningFactionId = ?
                group by ownedPolygon.OwningFactionId, adjacentPolygon.Id", [$factionId]);
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
                
                if(array_key_exists("HasOpponents", $dbPolygon))
                    $polygonList[$polygonIdOnMap]["HasOpponents"] = $dbPolygon["HasOpponents"];
                
                $polygonList[$polygonIdOnMap]["Points"] = array();
            }
            
            $polygonList[$polygonIdOnMap]["Points"][] = $dbPolygon["X"];
            $polygonList[$polygonIdOnMap]["Points"][] = $dbPolygon["Y"];
        }
        
        return $polygonList;
    }
    
    public static function outputMapForCampaign($campaignId, $mapImageWidth, $mapImageHeight, $mapImageName) {
        $width = 1024;
        $height = 768;
        $image = imagecreatetruecolor($width, $height);
        imagealphablending($image, true);
        imagesavealpha($image, true);
        
        $mapImageLocation = "/img/" . $mapImageWidth . "x" . $mapImageHeight . "/" . $mapImageName;
        $starmap = imagecreatefromjpeg(Server::getFullPath() . $mapImageLocation);
        imagecopy($image, $starmap, 0, 0, 0, 0, $width, $height);
        
        $dbTerritoryList = Database::queryArray(
            "select IdOnMap, Faction.Colour, TerritoryPoint.X, TerritoryPoint.Y 
            from Territory 
            join TerritoryPoint on TerritoryPoint.TerritoryId = Territory.Id
            left join Faction on Faction.Id = Territory.OwningFactionId
            where Territory.CampaignId=?", 
            [$campaignId]);
            
        foreach(self::getPolygonListFromDatabasePolygonList($dbTerritoryList) as $polygon) {
            // skip unwanted polygons
            if(!array_key_exists("Colour", $polygon) || $polygon["Colour"] === null)
                continue;

            list($red, $green, $blue) = sscanf($polygon["Colour"], "%02x%02x%02x");
            $colour = imagecolorallocatealpha($image, $red, $green, $blue, 80);
            imagefilledpolygon($image, $polygon["Points"], count($polygon["Points"]) / 2, $colour);
        }

        $dbAttackedTerritoryList = Database::queryArray(
            "select IdOnMap, TerritoryPoint.X, TerritoryPoint.Y,
                (select Faction.Colour
                    from FactionEntry
                    join Faction on Faction.Id = FactionEntry.FactionId
                    where FactionEntry.EntryId = Entry.Id
                    limit 1) as Colour, -- don't care which faction colour, as when there are multiple it uses red, regardless
                (select case count(*) when 0 then 0 else 1 end
                    from FactionEntry fe1 
                    join FactionEntry fe2 on fe2.EntryId = fe1.EntryId and fe2.FactionId != fe1.FactionId 
                    where fe1.EntryId=Entry.Id) as HasOpponents
                from Territory
                join TerritoryPoint on TerritoryPoint.TerritoryId = Territory.Id
                join Entry on Entry.TerritoryBeingAttackedIdOnMap = Territory.IdOnMap and Entry.CampaignId = Territory.CampaignId and Entry.FinishDate is null
                where Territory.CampaignId = ?
                order by TerritoryPoint.TerritoryId, TerritoryPoint.PointNumber",
                [$campaignId]);
                
        $attackedTile = imagecreatefrompng(Server::getFullPath() . '/img/attacked.png');
        imageSetTile($image, $attackedTile);
        foreach(self::getPolygonListFromDatabasePolygonList($dbAttackedTerritoryList) as $polygon) {
            // skip unwanted polygons
            if(!array_key_exists("Colour", $polygon) || $polygon["Colour"] === null)
                continue;

            $attackedTile = imagecreatefrompng(Server::getFullPath() . '/img/attacked.png');
            imageSetTile($image, $attackedTile);
            
            if($polygon["HasOpponents"]) {
                $red = 255;
                $green = 0;
                $blue = 0;
            } else {
                list($red, $green, $blue) = sscanf($polygon["Colour"], "%02x%02x%02x");
            }

            imagefilter($attackedTile, IMG_FILTER_COLORIZE, $red, $green, $blue, 40);
            imagefilledpolygon($image, $polygon["Points"], count($polygon["Points"]) / 2, IMG_COLOR_TILED);
        }
        
        $sectorImage = imagecreatefrompng(MapMapper::getMapFileNameForCampaign($campaignId));
        imagecopy($image, $sectorImage, 0, 0, 0, 0, $width, $height);
        
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

        $n = 30;
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
        $mapReturnData = array();
        $font = Server::getFullPath() . '/font/arial.ttf';
        foreach ($diagram['cells'] as $cell) {
            $points = MapMapper::getPolygonPoints($cell);

            // draw the sectors
            imagesetthickness($map, 3);
            imagepolygon($map, $points->points, $points->count, $lineShadow);
            imagesetthickness($map, 1);
            imagepolygon($map, $points->points, $points->count, $lineColor);
            
            // Center the text inside the center of the polygon
            $center = MapMapper::getCenter($points->pointsForCenterCalculation);
            $textBoundingBox = imagettfbbox($fontSize, 0, $font, $areaNumber + 1);
            imagettftext($map, $fontSize, 0, $center->x - ($textBoundingBox[0] / 2), $center->y - ($textBoundingBox[1] / 2), $lineShadow, $font, $areaNumber + 1);
            imagettftext($map, $fontSize - 2, 0, $center->x - ($textBoundingBox[0] / 2), $center->y - ($textBoundingBox[1] / 2), $lineColor, $font, $areaNumber + 1);
            
            Database::execute("INSERT INTO Territory (CampaignId, IdOnMap) VALUES (?, ?)", [$campaignId, $areaNumber + 1]);
            $polygonId = Database::getLastInsertedId();
            $pointNumber = 0;
            $insertingPolygon = array("Id" => $polygonId, "IdOnMap" => $areaNumber + 1, "Points" => array());
            
            foreach($points->pointsForCenterCalculation as $pointToSave) {
                Database::execute("INSERT INTO TerritoryPoint (TerritoryId, X, Y, PointNumber) VALUES (?, ?, ?, ?)", [$polygonId, $pointToSave->x, $pointToSave->y, $pointNumber]);
                $insertingPolygon["Points"][] = array("X" =>  $pointToSave->x, "Y" => $pointToSave->y, "PointNumber" => $pointNumber);
                $pointNumber++;
            }

            $mapReturnData[] = $insertingPolygon;
            $areaNumber++;
        }

        imagepng($map, MapMapper::getMapFileNameForCampaign($campaignId));
        
        return $mapReturnData;
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