<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 28.04.2016
     * Time: 21:54
     */
    //error_reporting(E_ALL);

    require_once "classes/PDO_MYSQL.php";
    require_once "classes/User.php";
    require_once "classes/Order.php";
    require_once "classes/FilamentType.php";

    $action = $_GET["action"];
    $user = \print3d\User::checkSession();

    if($action == "getOwnOrders") {
        $orders = \print3d\Order::getAllOrdersPerUser($user);
        $json_array = ["orders" => []];
        foreach($orders as $order) {
            array_push($json_array["orders"], $order->asArray());
        }
        echo json_encode($json_array);
    } else if($action == "getOwnOldOrders") {
        $orders = \print3d\Order::getAllOldOrdersPerUser($user);
        $json_array = ["orders" => []];
        foreach($orders as $order) {
            array_push($json_array["orders"], $order->asArray());
        }
        echo json_encode($json_array);
    } else if($action == "newOrder") {

    } else if($action == "orderDetails") {
        $oid = $_GET["oID"];
        $json_array = [];
        if(is_numeric($oid)) {
            $order = \print3d\Order::fromOID($oid);
            $json_array["order"] = $order->asArray();
        } else {
            $json_array["error"] = true;
        }

        echo json_encode($json_array);
    } else if($action == "getFilaments") {
        $filaments = \print3d\FilamentType::getAllAvailableFilaments();
        $json_array = ["filaments" => []] ;
        foreach ($filaments as $filament) {
            array_push($json_array["filaments"], $filament->asArray());
        }
        echo json_encode($json_array);
    } else if($action == "getThingiverseImg") {
        $link = $_GET["link"];
        $html = file_get_contents($link);

        $doc = new DOMDocument();
        $doc->loadHTML($html);

        $tags = $doc->getElementsByTagName('img');

        foreach ($tags as $tag) {
            if(strpos($tag->getAttribute('src'), "renders") && !(strpos($tag->getAttribute('src'), "thumb_small"))) {
                echo json_encode(["link" => $tag->getAttribute("src")]);
                exit;
            }
        }
    }