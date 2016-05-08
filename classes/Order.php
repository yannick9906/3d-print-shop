<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 27.04.2016
     * Time: 20:50
     */

    namespace print3d;


    class Order {
        public $STATEICON  = ["plus","coin","bookmark-check","printer-3d","cube","cube-send","check","delete","cached",  -1 => "printer-alert", -2 => "auto-fix"];
        public $STATECOLOR = ["blue","blue","green","green","green","green","green","red","orange", -1 => "red", -2 => "red darken-2"];
        public $STATETEXT  = ["Erstellt","Preisangebot","Bestellt","Druckt...","Druck fertig","Zugestellt","Abgeschlossen","Gelöscht","Garantiefall", -1 => "Technisches Problem", -2 => "Nicht druckbar"];

        private $oID, $uID, $filamentType;
        private $date_created, $date_confirmed, $date_completed;
        private $state, $comment, $precision;
        private $order_name, $order_link;
        private $material_length, $material_weight;
        private $print_time;
        private $total_cost, $material_cost, $energy_cost, $cost = 40;

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
            if($date_confirmed != "0000-00-00 00:00:00") $this->date_confirmed = strtotime($date_confirmed);
            else $this->date_confirmed = 0;
            if($date_completed != "0000-00-00 00:00:00") $this->date_completed = strtotime($date_completed);
            else $this->date_completed = 0;
            $this->state = $state;
            $this->comment = $comment;
            if($precision != null) $this->precision = $precision;
            else $this->precision = 0;
            $this->order_name = $order_name;
            $this->order_link = $order_link;
            if($material_length != null) $this->material_length = $material_length;
            else $this->material_length = 0;
            if($material_weight != null) $this->material_weight = $material_weight;
            else $this->material_weight = 0;
            $this->print_time = $print_time;
            $this->material_cost = FilamentType::fromFID($filamentType)->getPriceFor($material_length);
            $this->energy_cost = FilamentType::fromFID($filamentType)->getEnergyPrice($print_time);
            $this->total_cost = $this->energy_cost + $this->material_cost + $this->cost;
        }

        /**
         * @param int $oid
         * @return Order
         */
        public static function fromOID($oid) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM print3d_orders WHERE oID = :oid",[":oid" => $oid]);
            return new Order($res->oID, $res->uID, $res->filamenttype, $res->date_created, $res->date_confirmed, $res->date_completed, $res->state, $res->comment, $res->precision, $res->order_name, $res->order_link, $res->material_length, $res->material_weight, $res->print_time);
        }

        /**
         * @return Order[]
         */
        public static function getAllOrders() {
            $pdo = new PDO_MYSQL();
            $stmt = $pdo->queryMulti("SELECT oID FROM print3d_orders");
            return $stmt->fetchAll(\PDO::FETCH_FUNC, "\\print3d\\Order::fromOID");
        }

        /**
         * @param User $user
         * @return Order[]
         */
        public static function getAllOrdersPerUser($user) {
            $pdo = new PDO_MYSQL();
            $stmt = $pdo->queryMulti("SELECT oID FROM print3d_orders WHERE uID = :uid AND state BETWEEN 0 AND 5", [":uid" => $user->getUID()]);
            return $stmt->fetchAll(\PDO::FETCH_FUNC, "\\print3d\\Order::fromOID");
        }

        /**
         * @param User $user
         * @return Order[]
         *
         * TODO States
         */
        public static function getAllOldOrdersPerUser($user) {
            $pdo = new PDO_MYSQL();
            $stmt = $pdo->queryMulti("SELECT oID FROM print3d_orders WHERE uID = :uid AND state NOT BETWEEN 0 AND 5", [":uid" => $user->getUID()]);
            return $stmt->fetchAll(\PDO::FETCH_FUNC, "\\print3d\\Order::fromOID");
        }

        /**
         * @return Order[]
         */
        public static function getAllOpenOrders() {
            $pdo = new PDO_MYSQL();
            $stmt = $pdo->queryMulti("SELECT oID FROM print3d_orders WHERE state BETWEEN 0 AND 5");
            return $stmt->fetchAll(\PDO::FETCH_FUNC, "\\print3d\\Order::fromOID");
        }

        /**
         * @param User $user
         * @param $title
         * @param $fID
         * @param $url
         * @param $comment
         */
        public static function createNew($user, $title, $fID, $url, $comment) {
            $pdo = new PDO_MYSQL();
            $pdo->query("INSERT INTO print3d_orders(uID, date_created, state, filamenttype, order_name, order_link, comment) VALUES (:uid, :date, 0, :fila, :title, :url, :comment)",
                [":uid" => $user->getUID(),":date" => date("Y-m-d H:i:s"),":fila" => $fID, ":title" => $title, ":url" => $url, ":comment" => $comment]);
        }

        public function asArray() {
            $printing = "";
            $style = "";
            $style2 = "";
            if($this->state == 3) $printing = "<div class=\"progress\"><div class=\"indeterminate\"></div></div>";
            if($this->state == 4) $printing = "<div class=\"progress\"><div class=\"determinate\" style=\"width: 100%;\"></div></div>";
            if($this->state == -2) {$style = "collection"; $style2 = "grey lighten-3";} else $style = "collection z-depth-1";
            setlocale(LC_MONETARY, "de_DE");
            if($this->date_confirmed != 0 && $this->date_completed != 0) {
                $date_confirmed = date("d. M Y - H:i:s",$this->date_confirmed);
                $date_completed = date("d. M Y - H:i:s",$this->date_completed);
            } elseif($this->date_confirmed == 0 && $this->date_completed == 0) {
                $date_confirmed = "Warte auf Annahme";
                $date_completed = "Warte auf Annahme";
            } elseif($this->date_confirmed != 0 && $this->date_completed == 0) {
                $date_confirmed = date("d. M Y - H:i:s",$this->date_confirmed);
                $date_completed = "Warte auf Einschätzung";
            }

            return [
                "oID" => $this->oID,
                "uID" => $this->uID,
                "realname" => User::fromUID($this->uID)->getRealname(),
                "order_name" => $this->order_name,
                "order_link" => $this->order_link,
                "date_created"   => date("d. M Y - H:i:s",$this->date_created),
                "date_confirmed" => $date_confirmed,
                "date_completed" => $date_completed,
                "printtime" => gmdate("H\h i\m s\s", $this->print_time),
                "comment" => $this->comment,
                "precision" => $this->precision,
                "filamentcolorname" => FilamentType::fromFID($this->filamentType)->getColorname(),
                "filamentcolorcode" => FilamentType::fromFID($this->filamentType)->getColorcode(),
                "filamentprice" => money_format("%i", FilamentType::fromFID($this->filamentType)->getPrice()/100),
                "complete_price" => money_format("%i", $this->total_cost/100),
                "material_price" => money_format("%i", $this->material_cost/100),
                "energy_price" => money_format("%i", $this->energy_cost/100),
                "material_weight" => $this->material_weight,
                "material_length" => $this->material_length,
                "state" => $this->state,
                "stateicon" => $this->STATEICON[$this->state],
                "statecolor" => $this->STATECOLOR[$this->state],
                "statetext" => $this->STATETEXT[$this->state],
                "style" => $style,
                "style2" => $style2,
                "printing" => $printing
            ];
        }

        /**
         * @param int|float $price
         * @return float
         */
        private static function cutPrice($price) {
            return (intval($price * 100) / 100);
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