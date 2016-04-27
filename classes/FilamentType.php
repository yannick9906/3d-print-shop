<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 27.04.2016
     * Time: 20:50
     */

    namespace print3d;


    class FilamentType {
        private $diameter;
        private $colorname, $colorcode;
        private $price;
        private $saleprice;
        private $available;

        /**
         * FilamentType constructor.
         *
         * @param int $diameter
         * @param string $colorname
         * @param string  $colorcode
         * @param int $price
         * @param int $saleprice
         * @param int $available
         */
        public function __construct($diameter, $colorname, $colorcode, $price, $saleprice, $available) {
            $this->diameter = $diameter;
            $this->colorname = $colorname;
            $this->colorcode = $colorcode;
            $this->price = $price;
            $this->saleprice = $saleprice;
            $this->available = $available == 1;
        }

        public static function fromFID($fID) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM print3d_filamenttypes WHERE fID = :fid", [":fid" => $fID]);
            return new FilamentType($res->diameter, $res->colorname, $res->colorcode, $res->price, $res->salesprice, $res->available)
        }

        /**
         * @return mixed
         */
        public function getDiameter() {
            return $this->diameter;
        }

        /**
         * @param mixed $diameter
         */
        public function setDiameter($diameter) {
            $this->diameter = $diameter;
        }

        /**
         * @return mixed
         */
        public function getColorname() {
            return $this->colorname;
        }

        /**
         * @param mixed $colorname
         */
        public function setColorname($colorname) {
            $this->colorname = $colorname;
        }

        /**
         * @return mixed
         */
        public function getColorcode() {
            return $this->colorcode;
        }

        /**
         * @param mixed $colorcode
         */
        public function setColorcode($colorcode) {
            $this->colorcode = $colorcode;
        }

        /**
         * @return mixed
         */
        public function getPrice() {
            return $this->price;
        }

        /**
         * @param mixed $price
         */
        public function setPrice($price) {
            $this->price = $price;
        }

        /**
         * @return mixed
         */
        public function getSaleprice() {
            return $this->saleprice;
        }

        /**
         * @param mixed $saleprice
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