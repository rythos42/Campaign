<?php 
class UserMapper {
    public static function insertUser($username, $password) {
        $existingUser = Database::queryObject("SELECT Id FROM User WHERE Username = ?", [$username]);
        if($existingUser)
            throw new Exception("That username has been taken."); 
        
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $today = date('Y-m-d H:i:s');
        Database::execute("INSERT INTO User (Username, PasswordHash, CreatedOnDate) VALUES (?, ?, ?)", [$username, $passwordHash, $today]);
        
        // In theory, this is the permission I want to try to sell. It's here for alpha testing.
        Database::execute("INSERT INTO PermissionGroup (PermissionId, UserId) VALUES (?, ?)", [1, Database::getLastInsertedId()]);
        
        return new User(Database::getLastInsertedId(), $username);
    }
    
    public static function updateLastLoginDate($userId) {
        Database::execute("UPDATE User SET LastLoginDate = ? WHERE Id=?", [date('Y-m-d H:i:s'), $userId]);
    }
    
    public static function validateLogin($username, $password) {
        $dbUser = Database::queryObject("SELECT Id, PasswordHash FROM User WHERE Username = ?", [$username]);
        if($dbUser && password_verify($password, $dbUser->PasswordHash)) {
            UserMapper::updateLastLoginDate($dbUser->Id);
            
            $permissions = Database::queryObjectList(
                "SELECT Permission.Id, Permission.Name FROM PermissionGroup JOIN Permission on Permission.Id = PermissionGroup.PermissionId WHERE UserId  = ?", 
                "Permission",
                [$dbUser->Id]);
                
            $userCampaignData = Database::queryArray("SELECT CampaignId, TerritoryBonus, Attacks FROM UserCampaignData WHERE UserId = ?", [$dbUser->Id]);
           
            return new User($dbUser->Id, $username, $permissions, $userCampaignData);
        }
        else {
            return null;
        }
    }
    
    public static function getUsersByFilter($term, $campaignId) {
        // Deliberately not retrieving PasswordHash here. Web client doesn't need it.
        return Database::queryArray(
            "select User.Id, Username, TerritoryBonus, Attacks from User join UserCampaignData on UserCampaignData.UserId = User.Id where Username like ? and CampaignId = ?", 
            ['%' . $term . '%', $campaignId]);
    }
    
    public static function getUserDataForCampaign($userId, $campaignId) {
        return Database::queryObject(
            "select TerritoryBonus, Attacks, MandatoryAttacks, OptionalAttacks, StartDate as PhaseStartDate
            from UserCampaignData 
            join Campaign on Campaign.Id = UserCampaignData.CampaignId 
            left outer join Phase on Phase.CampaignId = Campaign.Id
            where UserId = ? and UserCampaignData.CampaignId = ?", 
            [$userId, $campaignId]);
    }
    
    public static function giveTerritoryBonusInCampaignTo($userId, $campaignId, $amount) {
        Database::execute("update UserCampaignData set TerritoryBonus = TerritoryBonus - ? where UserId = ? and CampaignId = ?", [$amount, User::getCurrentUser()->getId(), $campaignId]);
        Database::execute("update UserCampaignData set TerritoryBonus = TerritoryBonus + ? where UserId = ? and CampaignId = ?", [$amount, $userId, $campaignId]);
    }
}
?>