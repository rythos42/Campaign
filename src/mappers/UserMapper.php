<?php 
class UserMapper {
    public static function insertUser($username, $password) {
        $user = Database::scalarObjectQuery("SELECT Id FROM User WHERE Username = ?", "s", $username);
        if($user !== null)
            throw new Exception("That username has been taken."); 
        
        $insertUserStatement = Database::prepare("INSERT INTO User (Username, PasswordHash, CreatedOnDate) VALUES (?, ?, ?)");
        
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $today = date('Y-m-d H:i:s');
        $insertUserStatement->bind_param("sss", $username, $passwordHash, $today);
        
        $insertUserStatement->execute();        
        $insertUserStatement->close();
    }
    
    public static function validateLogin($username, $password) {
        $query = Database::prepare("SELECT Id, PasswordHash FROM User WHERE Username = ?");
        
        $query->bind_param("s", $username);
        $query->execute();
        
        $results = $query->get_result();
        $user = $results->fetch_object();

        $query->close();
        if($user && password_verify($password, $user->PasswordHash)) {
            return new User($user->Id, $username);
        }
        else {
            return null;
        }
    }
    
    public static function getUsersByFilter($term) {
        // Deliberately not retrieving PasswordHash here. Web client doesn't need it.
        $query = Database::prepare("SELECT Id, Username FROM User WHERE Username like ?");
        
        $term = '%' . $term . '%';
        $query->bind_param("s", $term);
        $query->execute();
        $results = $query->get_result();
        
        $userList = array();
        while($user = $results->fetch_object()) {
            $userList[] = $user;
        }
        return $userList;
    }
}
?>