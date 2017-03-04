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
        $dbUser = Database::queryObject("SELECT Id, PasswordHash, TerritoryBonus FROM User WHERE Username = ?", [$username]);
        if($dbUser && password_verify($password, $dbUser->PasswordHash)) {
            $today = date('Y-m-d H:i:s');
            Database::execute("UPDATE User SET LastLoginDate = ? WHERE Id=?", [$today, $dbUser->Id]);
            
            $permissions = Database::queryObjectList(
                "SELECT Permission.Id, Permission.Name FROM PermissionGroup JOIN Permission on Permission.Id = PermissionGroup.PermissionId WHERE UserId  = ?", 
                "Permission",
                [$dbUser->Id]);
                           
            return new User($dbUser->Id, $username, $permissions, $dbUser->TerritoryBonus);
        }
        else {
            return null;
        }
    }
    
    public static function getUsersByFilter($term) {
        // Deliberately not retrieving PasswordHash here. Web client doesn't need it.
        return Database::queryArray("SELECT Id, Username FROM User WHERE Username LIKE ?", ['%' . $term . '%']);
    }
    
    public static function getUserData($userId) {
        $dbUser = Database::queryObject("SELECT Username, TerritoryBonus FROM User WHERE Id = ?", [$userId]);
        $permissions = Database::queryObjectList(
            "SELECT Permission.Id, Permission.Name FROM PermissionGroup JOIN Permission on Permission.Id = PermissionGroup.PermissionId WHERE UserId  = ?", 
            "Permission",
            [$userId]);
            
        return new User($userId, $dbUser->Username, $permissions, $dbUser->TerritoryBonus);
    }
    
    public static function giveTerritoryBonusTo($userId, $amount) {
        Database::execute("update User set TerritoryBonus = TerritoryBonus - ? where Id = ?", [$amount, User::getCurrentUser()->getId()]);
        Database::execute("update User set TerritoryBonus = TerritoryBonus + ? where Id = ?", [$amount, $userId]);
    }
}
?>