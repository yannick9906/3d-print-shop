<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 06.09.2016
     * Time: 20:17
     */

    namespace print3d;


    class Util {

        /**
         * @param $secs int
         * @return string
         */
        public static function seconds_to_time($secs) {
            $dt = new \DateTime('@' . $secs, new \DateTimeZone('UTC'));
            $array = array('days'    => $dt->format('z'),
                           'hours'   => $dt->format('G'),
                           'minutes' => $dt->format('i'),
                           'seconds' => $dt->format('s'));
            if($array["days"] == 1) return $array["days"]." Tag ".$array["hours"]."h ".$array["minutes"]."m ".$array["seconds"]."s";
            else return $array["days"]." Tage ".$array["hours"]."h ".$array["minutes"]."m ".$array["seconds"]."s";
        }

        public static function getThingiverse($link) {
            $html = file_get_contents($link);

            $doc = new \DOMDocument();
            $doc->loadHTML($html);
            $tags = $doc->getElementsByTagName('img');

            foreach ($tags as $tag) {
                if(strpos($tag->getAttribute('src'), "renders") && !(strpos($tag->getAttribute('src'), "thumb_small"))) {
                    $src = $tag->getAttribute("src");
                    return $src;
                }
            }
        }
    }