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

        /**
         * FilamentType constructor.
         *
         * @param $diameter
         * @param $colorname
         * @param $colorcode
         * @param $price
         * @param $saleprice
         */
        public function __construct($diameter, $colorname, $colorcode, $price, $saleprice) {
            $this->diameter = $diameter;
            $this->colorname = $colorname;
            $this->colorcode = $colorcode;
            $this->price = $price;
            $this->saleprice = $saleprice;
        }


    }