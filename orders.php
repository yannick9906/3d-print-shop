<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 28.04.2016
     * Time: 21:54
     */


    require_once "classes/PDO_MYSQL.php";
    require_once "classes/User.php";
    require_once "classes/Order.php";
    require_once "classes/FilamentType.php";

    $action = $_GET["action"];
    $user = \print3d\User::checkSession();

    if($action == "getOwnOrders") {
        $orders = \print3d\Order::getAllOrdersPerUser($user);
        $json_array = []
        foreach($orders as $order) {
            array_push($json_array["orders"], $order->asArray());
        }
        echo json_encode($json_array);
    } else if($action == "getOwnOldOrders") {
        $orders = \print3d\Order::getAllOldOrdersPerUser($user);
        $json_array = []
        foreach($orders as $order) {
            array_push($json_array["orders"], $order->asArray());
        }
        echo json_encode($json_array);
    } else if($action == "newOrder") {

    } else if($action == "orderDetails") {

    } else if($action == "getFilaments") {

    }