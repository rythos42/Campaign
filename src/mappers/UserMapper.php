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
    
    public static function validateLogin($username, $password) {
        $dbUser = Database::queryObject("SELECT Id, PasswordHash FROM User WHERE Username = ?", [$username]);
        if($dbUser && password_verify($password, $dbUser->PasswordHash)) {
            $today = date('Y-m-d H:i:s');
            Database::execute("UPDATE User SET LastLoginDate = ? WHERE Id=?", [$today, $dbUser->Id]);
            
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
    
    public static function getUsersByFilter($term) {
        // Deliberately not retrieving PasswordHash here. Web client doesn't need it.
        $dbUserList = Database::queryArray("SELECT Id, Username FROM User WHERE Username LIKE ?", ['%' . $term . '%']);
        $userList = array();
        foreach($dbUserList as $user) {
            $user["UserCampaignData"] = Database::queryArray("SELECT CampaignId, TerritoryBonus, Attacks FROM UserCampaignData WHERE UserId = ?", [$user["Id"]]);
            $userList[] = $user;
        }
        return $userList;
    }
    
    public static function getUserDataForCampaign($userId, $campaignId) {
        UserMapper::ensureUserDataExists($userId, $campaignId);
        return Database::queryObject(
            "SELECT TerritoryBonus, Attacks, MandatoryAttacks, OptionalAttacks FROM UserCampaignData JOIN Campaign on Campaign.Id = UserCampaignData.CampaignId WHERE UserId = ? AND CampaignId = ?", 
            [$userId, $campaignId]);
    }
    
    public static function ensureUserDataExists($userId, $campaignId) {
        // I feel like this could be done better elsewhere...
        if(!Database::exists("SELECT * FROM UserCampaignData WHERE UserId = ? AND CampaignId = ?", [$userId, $campaignId]))
            Database::execute("INSERT INTO UserCampaignData (UserId, CampaignId) VALUES (?, ?)", [$userId, $campaignId]);
    }
    
    public static function giveTerritoryBonusInCampaignTo($userId, $campaignId, $amount) {
        UserMapper::ensureUserDataExists(User::getCurrentUser()->getId(), $campaignId);
        UserMapper::ensureUserDataExists($userId, $campaignId);

        Database::execute("update UserCampaignData set TerritoryBonus = TerritoryBonus - ? where UserId = ? and CampaignId = ?", [$amount, User::getCurrentUser()->getId(), $campaignId]);
        Database::execute("update UserCampaignData set TerritoryBonus = TerritoryBonus + ? where UserId = ? and CampaignId = ?", [$amount, $userId, $campaignId]);
    }
}
?>