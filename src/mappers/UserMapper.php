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
        $dbUser = Database::queryObject("SELECT Id, Email, PasswordHash FROM User WHERE Username = ?", [$username]);
        if($dbUser && password_verify($password, $dbUser->PasswordHash)) {
            UserMapper::updateLastLoginDate($dbUser->Id);
            
            $permissions = Database::queryObjectList(
                "SELECT Permission.Id, Permission.Name FROM PermissionGroup JOIN Permission on Permission.Id = PermissionGroup.PermissionId WHERE UserId  = ?", 
                "Permission",
                [$dbUser->Id]);
                
            $userCampaignData = Database::queryArray("SELECT CampaignId, TerritoryBonus, Attacks FROM UserCampaignData WHERE UserId = ?", [$dbUser->Id]);
           
            return new User($dbUser->Id, $username, $dbUser->Email, $permissions, $userCampaignData);
        }
        else {
            return null;
        }
    }
    
    public static function getUsersByFilter($term, $campaignId) {
        // Deliberately not retrieving PasswordHash here. Web client doesn't need it.
        return Database::queryArray(
            "select User.Id, User.Username, User.Email, UserCampaignData.TerritoryBonus, UserCampaignData.Attacks, UserCampaignData.FactionId, UserCampaignData.IsAdmin 
            from User 
            join UserCampaignData on UserCampaignData.UserId = User.Id 
            where Username like ? and CampaignId = ?", 
            ['%' . $term . '%', $campaignId]);
    }
    
    public static function getUserDataForCampaign($userId, $campaignId) {
        return Database::queryObject(
            "select TerritoryBonus, Attacks, MandatoryAttacks, OptionalAttacks, StartDate as PhaseStartDate, FactionId, IsAdmin, LastEntry.CreatedOnDate as LastCreatedEntryDate
            from UserCampaignData 
            join Campaign on Campaign.Id = UserCampaignData.CampaignId 
            left outer join Phase on Phase.CampaignId = Campaign.Id
            left outer join (
                    select max(CreatedOnDate) as CreatedOnDate, CreatedByUserId  
                    from Entry where CreatedByUserId = ? and CampaignId = ?
                ) LastEntry on LastEntry.CreatedByUserId = UserCampaignData.UserId
            where UserId = ? and UserCampaignData.CampaignId = ?", 
            [$userId, $campaignId, $userId, $campaignId]);
    }
    
    public static function giveTerritoryBonusInCampaignTo($userId, $campaignId, $amount, $takeFromMe) {
        if($takeFromMe)
            Database::execute("update UserCampaignData set TerritoryBonus = TerritoryBonus - ? where UserId = ? and CampaignId = ?", [$amount, User::getCurrentUser()->getId(), $campaignId]);
        
        Database::execute("update UserCampaignData set TerritoryBonus = TerritoryBonus + ? where UserId = ? and CampaignId = ?", [$amount, $userId, $campaignId]);
    }
    
    public static function saveUserProfile($user) {
        User::getCurrentUser()->setEmail($user->email);
        
        Database::execute("update User set Email = ? where Id = ?", [$user->email, $user->id]);
    }
    
    public static function setUserAdminForCampaign($campaignId, $userId, $isAdminForCurrentCampaign) {
        $isAdmin = $isAdminForCurrentCampaign === 'true' ? 1 : 0;
        Database::execute("update UserCampaignData set IsAdmin = ? where UserId = ? and CampaignId = ?", [$isAdmin, $userId, $campaignId]);
    }
    
    public static function getUserById($userId) {
        $user = Database::queryObject("select Username, Email from User where Id = ?", [$userId]);
        $permissions = Database::queryObjectList(
            "select Permission.Id, Permission.Name from PermissionGroup join Permission on Permission.Id = PermissionGroup.PermissionId where UserId  = ?", "Permission", [$userId]);
        $userCampaignData = Database::queryArray("select CampaignId, TerritoryBonus, Attacks from UserCampaignData where UserId = ?", [$userId]);
           
        return new User($userId, $user->Username, $user->Email, $permissions, $userCampaignData);
    }
    
    public static function getUserByCookie($cookie) {
        $pieces = explode(":", $cookie);
        $authTokenId = $pieces[0];
        
        $token = Database::queryObject("select HashedToken, UserId, Expires from AuthorizationToken where Id = ?", [$authTokenId]);
        if(!$token)
            return null;

        $hashedToken = hash('sha256', $pieces[1]);
        if($token->HashedToken !== $hashedToken)
            return null;
        
        if($token->Expires > time())
            return null;

        return UserMapper::getUserById($token->UserId);
    }
    
    public static function createAuthorizationTokenCookie($user) {
        $expiry = date('Y-m-d H:i:s', time() + User::$TokenExpirySeconds);
        $token = bin2hex(random_bytes(64));
        $hashedToken = hash('sha256', $token);
        
        Database::execute("insert into AuthorizationToken (HashedToken, UserId, Expires) values (?, ?, ?)", [$hashedToken, $user->getId(), $expiry]);
        
        $authTokenId = Database::getLastInsertedId();
        return $authTokenId . ':' . $token;
    }
    
    public static function setOneSignalUserId($userId, $oneSignalUserId) {
        Database::execute("update User set OneSignalUserId = ? where Id = ?", [$oneSignalUserId, $userId]);
    }
    
    public static function getAllJoinedCampaignIds($userId) {
        return Database::queryScalarList("select CampaignId from UserCampaignData where UserId = ?", [$userId]);
    }
    
    public static function forgotPassword($username) {
        $email = Database::queryScalar("select Email from User where Username = ?", [$username]);
        if(!$email)
            return false;
        
        // generate a cryptographically secure random password and update the users password to be it
        $factory = new RandomLib\Factory;
        $generator = $factory->getGenerator(new SecurityLib\Strength(SecurityLib\Strength::MEDIUM));
        $randomPassword = $generator->generateString(8);    // password length
        $passwordHash = password_hash($randomPassword, PASSWORD_DEFAULT);
        Database::execute("update User set PasswordHash = ? where Username = ?", [$passwordHash, $username]);
        
        // send the e-mail
        Translation::loadTranslationFiles(Server::getFullPath() . "/lang");
        $to = $email;
        $subject = Translation::getString("resetPasswordEmailSubject");
        $message = sprintf(Translation::getString("resetPasswordEmailBody"), $randomPassword);
        $from = Settings::getSystemFromEmailAddress();
        $headers = "From: $from\r\nReply-To: $from\r\nX-Mailer: PHP/" . phpversion();
        mail($to, $subject, $message, $headers);
        
        return true;
    }
    
    public static function changePassword($userId, $newPassword) {
        $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);
        Database::execute("update User set PasswordHash = ? where Id = ?", [$passwordHash, $userId]);
    }
}
?>