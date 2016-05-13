<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 13.05.2016
     * Time: 13:24
     */

    require_once "classes/User.php";
    require_once "classes/Order.php";
    require_once "classes/PDO_MYSQL.php";
    require_once "classes/emailtext.php";
    require_once "classes/FilamentType.php";
    $action = $_GET["action"];
    $oid = $_GET["oid"];

    if($action == "accept" && is_numeric($oid)) {
        $order = \print3d\Order::fromOID($oid);
        if($order->getState() == 1) {
            $order->setState(2);
            $order->saveChanges();
        }
    }