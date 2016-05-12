<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 27.04.2016
     * Time: 20:50
     */

    namespace print3d;


    class FilamentType {
        private $fID;
        private $diameter;
        private $colorname, $colorcode;
        private $price;
        private $saleprice;
        private $available;
        private $weight = 0.00125;

        /**
         * FilamentType constructor.
         *
         * @param float $diameter
         * @param string $colorname
         * @param string  $colorcode
         * @param int $price
         * @param int $saleprice
         * @param int $available
         */
        public function __construct($fID, $diameter, $colorname, $colorcode, $price, $saleprice, $available) {
            $this->fID = $fID;
            $this->diameter = $diameter;
            $this->colorname = $colorname;
            $this->colorcode = $colorcode;
            $this->price = $price;
            if($saleprice == null) $this->saleprice = 0;
            else $this->saleprice = $saleprice;
            $this->available = $available == 1;
        }

        /**
         * @param int $fID
         * @return FilamentType
         */
        public static function fromFID($fID) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM print3d_filamenttypes WHERE fID = :fid", [":fid" => $fID]);
            return new FilamentType($res->fID, $res->diameter, $res->colorname, $res->colorcode, $res->price, $res->salesprice, $res->available);
        }

        /**
         * @return FilamentType[]
         */
        public static function getAllFilaments() {
            $pdo = new PDO_MYSQL();
            $stmt = $pdo->queryMulti("SELECT fID FROM print3d_filamenttypes ORDER BY available DESC, colorname");
            return $stmt->fetchAll(\PDO::FETCH_FUNC, "\\print3d\\FilamentType::fromFID");
        }

        /**
         * @return FilamentType[]
         */
        public static function getAllAvailableFilaments() {
            $pdo = new PDO_MYSQL();
            $stmt = $pdo->queryMulti("SELECT fID FROM print3d_filamenttypes WHERE available = 1");
            return $stmt->fetchAll(\PDO::FETCH_FUNC, "\\print3d\\FilamentType::fromFID");
        }

        /**
         * Creates a new Entry in the db
         *
         * @param string $colorname
         * @param string $colorcode
         * @param int    $price
         * @param int    $saleprice
         * @param bool   $active
         * @param int    $diameter
         */
        public static function createNew($colorname, $colorcode, $price, $saleprice, $active, $diameter) {
            $pdo = new PDO_MYSQL();
            $pdo->query("INSERT INTO print3d_filamenttypes(diameter, colorname, colorcode, price, salesprice, available) VALUES (:diameter, :colorname, :colorcode, :price, :saleprice, :active)",
                [":diameter" => $diameter, ":colorcode" => $colorcode, ":colorname" => $colorname, ":price" => $price, ":saleprice" => $saleprice, ":active" => $active?1:0]);
        }

        /**
         * Saves this object to the db
         */
        public function saveChanges() {
            $pdo = new PDO_MYSQL();
            $pdo->query("UPDATE print3d_filamenttypes SET diameter = :diameter, colorname = :colorname, colorcode = :colorcode, price = :price, salesprice = :saleprice, available = :active WHERE fID = :fid",
                [":diameter" => $this->diameter, ":colorcode" => $this->colorcode, ":colorname" => $this->colorname, ":price" => $this->price, ":saleprice" => $this->saleprice, ":active" => $this->available?1:0, ":fid" => $this->fID]);
        }

        public function getWeightFor($length) {
            $radius       = $this->diameter / 2;
            $area         = $radius * $radius * 3.1415926535897932384626433832795;
            return $area * $length * $this->weight;
        }

        public function getPriceFor($length) {
                return (($this->getWeightFor($length)/1000) * $this->getPrice());
        }

        public function getEnergyPrice($time) {
            $time = $time / 60 / 60;
            $kWh = (200 * $time) / 1000;
            return 25 * $kWh;
        }

        public function asArray() {
            return [
                "fID" => $this->fID,
                "filamentcolorname" => $this->getColorname(),
                "filamentcolorcode" => str_replace("#", "", $this->getColorcode()),
                "price" => money_format("%i", $this->getPrice()/100),
                "priceHTML" => $this->price,
                "priceSell" => $this->saleprice,
                "diameter" => $this->diameter,
                "active" => $this->available,
                "style" => $this->available ? "collection z-depth-1":"collection",
                "style2" => $this->available ? "":"grey lighten-1"
            ];
        }

        /**
         * @return float
         */
        public function getDiameter() {
            return $this->diameter;
        }

        /**
         * @param float $diameter
         */
        public function setDiameter($diameter) {
            $this->diameter = $diameter;
        }

        /**
         * @return string
         */
        public function getColorname() {
            return $this->colorname;
        }

        /**
         * @param string $colorname
         */
        public function setColorname($colorname) {
            $this->colorname = $colorname;
        }

        /**
         * @return string
         */
        public function getColorcode() {
            return $this->colorcode;
        }

        /**
         * @param string $colorcode
         */
        public function setColorcode($colorcode) {
            $this->colorcode = $colorcode;
        }

        /**
         * @return int
         */
        public function getPrice() {
            if($this->saleprice != 0) return $this->saleprice;
            else return$this->price;
        }

        /**
         * @param int $price
         */
        public function setPrice($price) {
            $this->price = $price;
        }

        /**
         * @return int
         */
        public function getSaleprice() {
            return $this->saleprice;
        }

        /**
         * @param int $saleprice
         */
        public function setSaleprice($saleprice) {
            $this->saleprice = $saleprice;
        }

        /**
         * @param bool $available
         */
        public function setAvailable($available) {
            $this->available = $available;
        }

        /**
         * @return bool
         */
        public function isAvailable() {
            return $this->available;
        }
    }