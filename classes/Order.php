<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 27.04.2016
     * Time: 20:50
     */

    namespace print3d;


    class Order {
        private $oID, $uID, $filamentType;
        private $date_created, $date_confirmed, $date_completed;
        private $state, $comment, $precision;
        private $order_name, $order_link;
        private $material_length, $material_weight;
        private $print_time;

        /**
         * Order constructor.
         *
         * @param int $oID
         * @param int $uID
         * @param int $filamentType
         * @param date $date_created
         * @param date $date_confirmed
         * @param date $date_completed
         * @param int $state
         * @param string $comment
         * @param int $precision
         * @param string $order_name
         * @param string $order_link
         * @param int $material_length
         * @param int $material_weight
         * @param int $print_time
         */
        public function __construct($oID, $uID, $filamentType, $date_created, $date_confirmed, $date_completed, $state, $comment, $precision, $order_name, $order_link, $material_length, $material_weight, $print_time) {
            $this->oID = $oID;
            $this->uID = $uID;
            $this->filamentType = $filamentType;
            $this->date_created = strtotime($date_created);
            $this->date_confirmed = strtotime($date_confirmed);
            $this->date_completed = strtotime($date_completed);
            $this->state = $state;
            $this->comment = $comment;
            $this->precision = $precision;
            $this->order_name = $order_name;
            $this->order_link = $order_link;
            $this->material_length = $material_length;
            $this->material_weight = $material_weight;
            $this->print_time = $print_time;
        }

        /**
         * @param int $oid
         * @return Order
         */
        public static function fromOID($oid) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM print3d_orders WHERE oID = :oid",[":oid" => $oid]);
            return new Order($res->oID, $res->uID, $res->filamentType, $res->date_created, $res->date_confirmed, $res->date_completed, $res->state, $res->comment, $res->precision, $res->order_name, $res->order_link, $res->material_length, $res->material_weight, $res->print_time);
        }

        /**
         * @return Order[]
         */
        public static function getAllOrders() {
            $pdo = new PDO_MYSQL();
            $stmt = $pdo->queryMulti("SELECT oID FROM print3d_orders");
            return $stmt->fetchAll(\PDO::FETCH_FUNC, "\\print3d\\Order::fromOID()");
        }

        /**
         * @param User $user
         * @return Order[]
         */
        public static function getAllOrdersPerUser($user) {
            $pdo = new PDO_MYSQL();
            $stmt = $pdo->queryMulti("SELECT oID FROM print3d_orders WHERE uID = :uid AND state < 10", [":uid" => $user->getUID()]);
            return $stmt->fetchAll(\PDO::FETCH_FUNC, "\\print3d\\Order::fromOID()");
        }

        /**
         * @return Order[]
         */
        public static function getAllOpenOrders() {
            $pdo = new PDO_MYSQL();
            $stmt = $pdo->queryMulti("SELECT oID FROM print3d_orders WHERE state < 10");
            return $stmt->fetchAll(\PDO::FETCH_FUNC, "\\print3d\\Order::fromOID()");
        }

        /**
         * @return int
         */
        public function getFilamentType() {
            return $this->filamentType;
        }

        /**
         * @param int $filamentType
         */
        public function setFilamentType($filamentType) {
            $this->filamentType = $filamentType;
        }

        /**
         * @return date
         */
        public function getDateConfirmed() {
            return $this->date_confirmed;
        }

        /**
         * @param date $date_confirmed
         */
        public function setDateConfirmed($date_confirmed) {
            $this->date_confirmed = $date_confirmed;
        }

        /**
         * @return date
         */
        public function getDateCompleted() {
            return $this->date_completed;
        }

        /**
         * @param date $date_completed
         */
        public function setDateCompleted($date_completed) {
            $this->date_completed = $date_completed;
        }

        /**
         * @return int
         */
        public function getState() {
            return $this->state;
        }

        /**
         * @param int $state
         */
        public function setState($state) {
            $this->state = $state;
        }

        /**
         * @return string
         */
        public function getComment() {
            return $this->comment;
        }

        /**
         * @param string $comment
         */
        public function setComment($comment) {
            $this->comment = $comment;
        }

        /**
         * @return int
         */
        public function getPrecision() {
            return $this->precision;
        }

        /**
         * @param int $precision
         */
        public function setPrecision($precision) {
            $this->precision = $precision;
        }

        /**
         * @return string
         */
        public function getOrderName() {
            return $this->order_name;
        }

        /**
         * @param string $order_name
         */
        public function setOrderName($order_name) {
            $this->order_name = $order_name;
        }

        /**
         * @return string
         */
        public function getOrderLink() {
            return $this->order_link;
        }

        /**
         * @param string $order_link
         */
        public function setOrderLink($order_link) {
            $this->order_link = $order_link;
        }

        /**
         * @return int
         */
        public function getMaterialLength() {
            return $this->material_length;
        }

        /**
         * @param int $material_length
         */
        public function setMaterialLength($material_length) {
            $this->material_length = $material_length;
        }

        /**
         * @return int
         */
        public function getPrintTime() {
            return $this->print_time;
        }

        /**
         * @param int $print_time
         */
        public function setPrintTime($print_time) {
            $this->print_time = $print_time;
        }

        /**
         * @return int
         */
        public function getOID() {
            return $this->oID;
        }

        /**
         * @return int
         */
        public function getUID() {
            return $this->uID;
        }

        /**
         * @return date
         */
        public function getDateCreated() {
            return $this->date_created;
        }

        /**
         * @return int
         */
        public function getMaterialWeight() {
            return $this->material_weight;
        }
    }