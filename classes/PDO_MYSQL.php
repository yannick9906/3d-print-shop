<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 27.04.2016
     * Time: 21:21
     */

    namespace print3d;


    use PDO;
    require_once 'passwd.php'; //DB Pdw

    class PDO_MYSQL {
        /**
         * Define global vars
         *
         * @var string host, pass, user, dbname
         * @var int port
         */
        private $host = 'ybook.lima-db.de';
        private $port = 3306;
        private $pass = "";
        private $user = 'USER302476';
        private $dbname = 'db_302476_1';

        /**
         * @return PDO PDO-Object
         */
        protected function connect() {
            $this->pass = getMysqlPasskey();
            $pdo = new PDO('mysql:host=' . $this->host . ';port=' . $this->port . ';dbname=' . $this->dbname, $this->user, $this->pass);
            $pdo->exec("set names utf8");
            return $pdo;
        }

        public function query($query, $array = []) {
            $db = $this->connect();
            $stmt = $db->prepare($query);
            if (!empty($array)) $stmt->execute($array); else $stmt->execute();
            return $stmt->fetchObject();
        }

        public function queryMulti($query, $array = []) {
            $db = $this->connect();
            $stmt = $db->prepare($query);
            if (!empty($array)) $stmt->execute($array); else $stmt->execute();
            return $stmt;
        }
    }