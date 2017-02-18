<?php 
class UserMapper {
    public static function insertUser($username, $password) {
        $existingUser = Database::queryObject("SELECT Id FROM User WHERE Username = ?", [$username]);
        if($existingUser)
            throw new Exception("That username has been taken."); 
        
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $today = date('Y-m-d H:i:s');
        Database::execute("INSERT INTO User (Username, PasswordHash, CreatedOnDate) VALUES (?, ?, ?)", [$username, $passwordHash, $today]);
    }
    
    public static function validateLogin($username, $password) {
        $user = Database::queryObject("SELECT Id, PasswordHash FROM User WHERE Username = ?", [$username]);
        if($user && password_verify($password, $user->PasswordHash)) {
            return new User($user->Id, $username);
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