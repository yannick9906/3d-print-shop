<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 13.05.2016
     * Time: 12:16
     */
    ini_set('display_errors', 1);
    error_reporting(E_ALL);

    require_once("lib/webpush/VAPID.php");

    var_dump(VAPID::createVapidKeys());