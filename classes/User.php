<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 27.04.2016
     * Time: 20:49
     */

    namespace print3d;


    class User {
        private $uID;
        private $username;
        private $passwdHash;
        private $email;
        private $realname;
        private $role;

        /**
         * User constructor.
         *
         * @param int    $uID
         * @param string $username
         * @param string $passwdHash
         * @param string $email
         * @param string $realname
         * @param int    $role
         */
        public function __construct($uID, $username, $passwdHash, $email, $realname, $role) {
            $this->uID = $uID;
            $this->username = utf8_encode($username);
            $this->passwdHash = utf8_encode($passwdHash);
            $this->email = utf8_encode($email);
            $this->realname = utf8_encode($realname);
            $this->role = $role;
        }

        /**
         * @param int $uID
         * @return User
         */
        public static function fromUID($uID) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM print3d_user WHERE uID = :uid", [":uid" => $uID]);
            return new User($res->uID, $res->username, $res->passwd, $res->email, $res->realname, $res->level);
        }

        /**
         * @param string $name
         * @return User
         */
        public static function fromUName($name) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM print3d_user WHERE username = :uname", [":uname" => $name]);
            return new User($res->uID, $res->username, $res->passwd, $res->email, $res->realname, $res->level);
        }

        /**
         * checks if a username is in the user db
         *
         * @param $uName string Username
         * @return bool
         */
        public static function doesUserNameExist($uName) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM print3d_user WHERE username = :uname", [":uname" => $uName]);
            return isset($res->uID);
        }
        /**
         * Returns all users as a array of Userobjects from db
         *
         * @return User[]
         */
        public static function getAllUsers() {
            $pdo = new PDO_MYSQL();
            $stmt = $pdo->queryMulti('SELECT uID FROM print3d_user ');
            return $stmt->fetchAll(PDO::FETCH_FUNC, "\\print3d\\User::fromUID");
        }

        /**
         * Deletes a user
         *
         * @return bool
         */
        public function delete() {
            $pdo = new PDO_MYSQL();
            return $pdo->query("DELETE FROM print3d_user WHERE uID = :uid", [":uid" => $this->uID]);
        }

        /**
         * Saves the Changes made to this object to the db
         */
        public function saveChanges() {
            $pdo = new PDO_MYSQL();
            $pdo->query("UPDATE print3d_user SET email = :Email, passwd = :Passwd, username = :Username, level = :lvl, realname = :Realname WHERE uID = :uID LIMIT 1",
                [":Email" => $this->email, ":Passwd" => $this->passwdHash, ":Username" => $this->username, ":uID" => $this->uID, ":lvl" => $this->role, ":Realname" => $this->realname]);
        }

        /**
         * Creates a new user from the give attribs
         *
         * @param $username string Username
         * @param $email string Email Adress
         * @param $passwdhash string md5 Hash of Password
         * @return User The new User as an Object
         */
        public static function createUser($username, $email, $passwdhash, $realname) {
            $pdo = new PDO_MYSQL();
            $pdo->query("INSERT INTO print3d_user(username, email, passwd, realname) VALUES (:Username, :Email, :Passwd, :Realname)",
                [":Username" => $username, ":Email" => $email, ":Passwd" => $passwdhash, ":Realname" => $realname]);
            return self::fromUName($username);
        }

        /**
         * @return bool|User
         */
        public static function checkSession() {
            session_start();
            if(!isset($_SESSION["uID"])) {
                self::forwardTo("appLogin.html");
                exit;
            } else {
                $user = User::fromUID($_SESSION["uID"]);
                if($_GET["m"] == "debug") {
                    echo "<pre style='display: block; position: absolute'>\n";
                    echo "[0] Perm Array Information:\n";
                    var_dump($user->getPermAsArray());
                    echo "\n[1] Permission Information:\n";
                    self::printPermission($user);
                    echo "\n[2] User Information:\n";
                    echo $user->toString();
                    echo "\n[3] Client Information:\n";
                    echo "    Arguments: ".$_SERVER["REQUEST_URI"]."\n";
                    echo "    Req Time : ".$_SERVER["REQUEST_TIME"]."ns\n";
                    echo "    Remote IP: ".$_SERVER["REMOTE_ADDR"]."\n";
                    echo "    Usr Agent: ".$_SERVER["HTTP_USER_AGENT"]."\n";
                    echo "</pre>\n";
                }
                return $user;
            }
        }

        /**
         * @return int
         */
        public function getUID() {
            return $this->uID;
        }

        /**
         * @return string
         */
        public function getUsername() {
            return $this->username;
        }

        /**
         * @param string $hash
         * @return bool
         */
        public function comparePassWDHash($hash) {
            return $hash == $this->passwdHash;
        }

        /**
         * @return string
         */
        public function getEmail() {
            return $this->email;
        }

        /**
         * @return string
         */
        public function getRealname() {
            return $this->realname;
        }

        /**
         * @return int
         */
        public function getRole() {
            return $this->role;
        }

        /**
         * @param string $username
         */
        public function setUsername($username) {
            $this->username = $username;
        }

        /**
         * @param string $passwdHash
         */
        public function setPasswdHash($old, $new) {
            if($this->comparePassWDHash($old)) {
                $this->passwdHash = $new;
                return true;
            } else return false;
        }

        /**
         * @param string $email
         */
        public function setEmail($email) {
            $this->email = $email;
        }

        /**
         * @param string $realname
         */
        public function setRealname($realname) {
            $this->realname = $realname;
        }

        /**
         * @param int $role
         */
        public function setRole($role) {
            $this->role = $role;
        }
    }