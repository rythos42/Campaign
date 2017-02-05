<?php 
class UserMapper {
    public static function insertUser($username, $password) {
        $query = Database::prepare("INSERT INTO User (Username, PasswordHash, CreatedOnDate) VALUES (?, ?, ?)");
        
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $today = date('Y-m-d H:i:s');
        $query->bind_param("sss", $username, $passwordHash, $today);
        
        $query->execute();        
        $query->close();
    }
    
    public static function validateLogin($username, $password) {
        $query = Database::prepare("SELECT Id, PasswordHash FROM User WHERE Username = ?");
        
        $query->bind_param("s", $username);
        $query->execute();
        
        $results = $query->get_result();
        $user = $results->fetch_object();

        $query->close();
        if(password_verify($password, $user->PasswordHash)) {
			return new User($user->Id, $username);
		}
		else {
			return null;
		}
    }
}
?>