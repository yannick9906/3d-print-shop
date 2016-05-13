<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 13.05.2016
     * Time: 12:16
     */
    error_reporting(E_ALL);

require_once "classes/User.php";
require_once "classes/Order.php";
require_once "classes/PDO_MYSQL.php";
require_once "classes/emailtext.php";
require_once "classes/FilamentType.php";

    $order = \print3d\Order::fromOID(20);
    $user = \print3d\User::fromUName("yannick");

    $order->setState(0, $user);
    $order->saveChanges();
    $order = \print3d\Order::fromOID(20);
    $order->setState(1, $user);