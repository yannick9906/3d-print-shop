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
        private $order_name, $order_link, $order_livestream;
        private $material_length, $material_weight;
        private $print_time;
        private $total_cost, $material_cost, $energy_cost, $cost;

        /**
         * Order constructor.
         *
         * @param int    $oID
         * @param int    $uID
         * @param int    $filamentType
         * @param date   $date_created
         * @param date   $date_confirmed
         * @param date   $date_completed
         * @param int    $state
         * @param string $comment
         * @param int    $precision
         * @param string $order_name
         * @param string $order_link
         * @param int    $material_length
         * @param int    $material_weight
         * @param int    $print_time
         * @param int    $cost
         * @param string $order_livestream
         */
        public function __construct($oID, $uID, $filamentType, $date_created, $date_confirmed, $date_completed, $state, $comment, $precision, $order_name, $order_link, $material_length, $material_weight, $print_time, $cost, $order_livestream) {
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
            $this->cost = $cost;
            $this->material_cost = FilamentType::fromFID($filamentType)->getPriceFor($material_length);
            $this->energy_cost = FilamentType::fromFID($filamentType)->getEnergyPrice($print_time);
            $this->total_cost = $this->energy_cost + $this->material_cost + $this->cost;
            $this->order_livestream = $order_livestream;
        }

        /**
         * @param int $oid
         * @return Order
         */
        public static function fromOID($oid) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM print3d_orders WHERE oID = :oid",[":oid" => $oid]);
            return new Order($res->oID, $res->uID, $res->filamenttype, $res->date_created, $res->date_confirmed, $res->date_completed, $res->state, $res->comment, $res->precision, $res->order_name, $res->order_link, $res->material_length, $res->material_weight, $res->print_time, $res->fixprice, $res->order_livestream);
        }

        /**
         * @return Order[]
         */
        public static function getAllOrders() {
            $pdo = new PDO_MYSQL();
            $stmt = $pdo->queryMulti("SELECT oID FROM print3d_orders ORDER BY date_created DESC");
            return $stmt->fetchAll(\PDO::FETCH_FUNC, "\\print3d\\Order::fromOID");
        }

        /**
         * @param User $user
         * @return Order[]
         */
        public static function getAllOrdersPerUser($user) {
            $pdo = new PDO_MYSQL();
            $stmt = $pdo->queryMulti("SELECT oID FROM print3d_orders WHERE uID = :uid AND state BETWEEN 0 AND 5 ORDER BY date_created DESC", [":uid" => $user->getUID()]);
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
            $stmt = $pdo->queryMulti("SELECT oID FROM print3d_orders WHERE uID = :uid AND state NOT BETWEEN 0 AND 5 ORDER BY date_created DESC", [":uid" => $user->getUID()]);
            return $stmt->fetchAll(\PDO::FETCH_FUNC, "\\print3d\\Order::fromOID");
        }

        /**
         * @return Order[]
         */
        public static function getAllOpenOrders() {
            $pdo = new PDO_MYSQL();
            $stmt = $pdo->queryMulti("SELECT oID FROM print3d_orders WHERE state BETWEEN 0 AND 5 ORDER BY date_created DESC");
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

        public function reorder($user) {
            self::createNew($user, $this->order_name, $this->filamentType, $this->order_link, $this->comment);
        }

        /**
         *
         */
        public function saveChanges() {
            $pdo = new PDO_MYSQL();
            $this->material_weight = FilamentType::fromFID($this->filamentType)->getWeightFor($this->material_length);
            $date_created = date("Y-m-d H:i:s", $this->date_created);
            if($this->date_confirmed == 0) $date_confirmed = null; else $date_confirmed =  date("Y-m-d H:i:s", $this->date_confirmed);
            if($this->date_completed == 0) $date_completed = null; else $date_completed =  date("Y-m-d H:i:s", $this->date_completed);
            $pdo->query("UPDATE print3d_orders SET date_created = :date_created, date_confirmed = :date_confirmed, date_completed = :date_completed, state = :state, filamenttype = :fiD, order_name = :order_name, order_link = :order_link, material_length = :length, material_weight = :weight, print_time = :time, comment = :comment, `precision` = :precision, fixprice = :fix, order_livestream = :live WHERE oID = :oid",
                [":date_created" => $date_created, ":date_confirmed" => $date_confirmed, ":date_completed" => $date_completed, ":state" => $this->state, ":fiD" => $this->filamentType, ":order_name" => $this->order_name, ":order_link" => $this->order_link, ":length" => $this->material_length, ":weight" => $this->material_weight, ":time" => $this->print_time, ":comment" => $this->comment, ":precision" => $this->precision, ":oid" => $this->oID, ":fix" => $this->cost, ":live" => $this->order_livestream]);
            
        }

        public function asArray() {
            $printing = "";
            $style = "";
            $style2 = "";
            if($this->state == 3) $printing = "<div class=\"progress\"><div class=\"indeterminate\"></div></div>";
            if($this->state == 4) $printing = "<div class=\"progress\"><div class=\"determinate\" style=\"width: 100%;\"></div></div>";
            if($this->state == -2 or $this->state == 6 or $this->state == 7) {$style = "collection"; $style2 = "grey lighten-3";} else $style = "collection z-depth-1";
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
                "date_confirmed_html" => str_replace("+02:00","",str_replace("+01:00","",date(DATE_W3C, $this->date_confirmed))),
                "date_completed" => $date_completed,
                "date_completed_html" => str_replace("+02:00","",str_replace("+01:00","",date(DATE_W3C, $this->date_completed))),
                "printtime" => Util::seconds_to_time($this->print_time),
                "printtime_plain" => $this->print_time,
                "comment" => $this->comment,
                "precision" => $this->precision,
                "filamentID" => $this->filamentType,
                "filamentcolorname" => FilamentType::fromFID($this->filamentType)->getColorname(),
                "filamentcolorcode" => FilamentType::fromFID($this->filamentType)->getColorcode(),
                "filamentprice" => money_format("%i", FilamentType::fromFID($this->filamentType)->getPrice()/100),
                "complete_price" => money_format("%i", $this->total_cost/100),
                "material_price" => money_format("%i", $this->material_cost/100),
                "energy_price" => money_format("%i", $this->energy_cost/100),
                "fix_price" => money_format("%i", $this->cost/100),
                "fix_price_html" => $this->cost,
                "material_weight" => $this->material_weight,
                "material_length" => $this->material_length,
                "state" => $this->state,
                "stateicon" => $this->STATEICON[$this->state],
                "statecolor" => $this->STATECOLOR[$this->state],
                "statetext" => $this->STATETEXT[$this->state],
                "style" => $style,
                "style2" => $style2,
                "printing" => $printing,
                "order_livestream" => $this->order_livestream
            ];
        }

        /**
         * @param int  $oldstate
         * @param int  $newstate
         */
        public function sendEmails($oldstate, $newstate) {
            $user = User::fromUID($this->uID);
            if($user->canReceiveEmails()) {
                if($oldstate == 0 && $newstate == 1) {
                    $subject = "Yannicks 3D Drucke - Ein Preisvorschlag für deine Bestellung({$this->oID}) ist verfügbar";
                    $text = getEmailTextPrice($this, $user);
                } elseif(($oldstate == 2 || $oldstate == 3) && $newstate == 4) {
                    $subject = "Yannicks 3D Drucke - Deine Bestellung wird gedruckt";
                    $text = getEmailTextPrint($this, $user);
                } elseif($newstate == -2) {
                    $subject = "Yannicks 3D Drucke - Deine Bestellung wurde abgelehnt";
                    $text = getEmailTextFail($this, $user);
                } else return;
                $to = $user->getEmail();
                $toname = $user->getRealname();
                $header  = 'MIME-Version: 1.0' . "\r\n";
                $header .= 'Content-type: multipart/alternative; charset="UTF-8"; boundary="b1_ad31a77529300ba7014d73b6127af5d2"' . "\r\n";

                $header .= "To: $toname <$to>" . "\r\n";
                $header .= 'From: Yannicks 3D Drucke <noreply@3d.yannickfelix.tk>' . "\r\n";
                $header .= 'Bcc: yannick.felix1999@gmail.com' . "\r\n";

                mail($to, $subject, $text, $header);
            }
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
         * @return int
         */
        public function getDateConfirmed() {
            return $this->date_confirmed;
        }

        /**
         * @param int $date_confirmed
         */
        public function setDateConfirmed($date_confirmed) {
            $this->date_confirmed = $date_confirmed;
        }

        /**
         * @return int
         */
        public function getDateCompleted() {
            return $this->date_completed;
        }

        /**
         * @param int $date_completed
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
         * @param int  $state
         */
        public function setState($state) {
            $this->sendEmails($this->state, $state);
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
         * @return int
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

        /**
         * @return int
         */
        public function getCost() {
            return $this->cost;
        }

        /**
         * @param int $cost
         */
        public function setCost($cost) {
            $this->cost = $cost;
        }

        /**
         * @return int
         */
        public function getTotalCost() {
            return $this->total_cost;
        }

        /**
         * @return float
         */
        public function getMaterialCost() {
            return $this->material_cost;
        }

        /**
         * @return int
         */
        public function getEnergyCost() {
            return $this->energy_cost;
        }

        /**
         * @return string
         */
        public function getOrderLivestream() {
            return $this->order_livestream;
        }

        /**
         * @param string $order_livestream
         */
        public function setOrderLivestream($order_livestream) {
            $this->order_livestream = $order_livestream;
        }
    }