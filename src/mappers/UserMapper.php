<?php 
class UserMapper {
    public static function insertUser($username, $password) {
        $existingUser = Database::queryObject("SELECT Id FROM User WHERE Username = ?", [$username]);
        if($existingUser)
            throw new Exception("That username has been taken."); 
        
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $today = date('Y-m-d H:i:s');
        Database::execute("INSERT INTO User (Username, PasswordHash, CreatedOnDate) VALUES (?, ?, ?)", [$username, $passwordHash, $today]);
        
        return new User(Database::getLastInsertedId(), $username);
    }
    
    public static function validateLogin($username, $password) {
        $dbUser = Database::queryObject("SELECT Id, PasswordHash FROM User WHERE Username = ?", [$username]);
        if($dbUser && password_verify($password, $dbUser->PasswordHash)) {
            $permissions = Database::queryObjectList(
                "SELECT Permission.Id, Permission.Name FROM PermissionGroup JOIN Permission on Permission.Id = PermissionGroup.PermissionId WHERE UserId  = ?", 
                "Permission",
                [$dbUser->Id]);
            
            return new User($dbUser->Id, $username, $permissions);
        }
        else {
            return null;
        }
    }
    
    public static function getUsersByFilter($term) {
        // Deliberately not retrieving PasswordHash here. Web client doesn't need it.
        return Database::queryArray("SELECT Id, Username FROM User WHERE Username LIKE ?", ['%' . $term . '%']);
    }
}
?>