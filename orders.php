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
    require_once "classes/Util.php";
    require_once "classes/Order.php";
    require_once "classes/FilamentType.php";
    require_once "classes/emailtext.php";

    $action = $_GET["action"];
    $user = \print3d\User::checkSession();

    if($action == "getOwnOrders") {
        $orders = \print3d\Order::getAllOrdersPerUser($user);
        $json_array = ["orders" => []];
        foreach($orders as $order) {
            array_push($json_array["orders"], $order->asArray());
        }
        echo json_encode($json_array);
    } elseif($action == "getOwnOldOrders") {
        $orders = \print3d\Order::getAllOldOrdersPerUser($user);
        $json_array = ["orders" => []];
        foreach($orders as $order) {
            array_push($json_array["orders"], $order->asArray());
        }
        echo json_encode($json_array);
    } elseif($action == "newOrder") {
        \print3d\Order::createNew($user, $_POST["title"], $_POST["fila"], $_POST["url"], $_POST["comment"]);
        echo json_encode(["success" => true]);
    } elseif($action == "orderDetails") {
        $oid = $_GET["oID"];
        $json_array = [];
        if(is_numeric($oid)) {
            $order = \print3d\Order::fromOID($oid);
            $json_array["order"] = $order->asArray();
        } else {
            $json_array["error"] = true;
        }

        echo json_encode($json_array);
    } elseif($action == "getFilaments") {
        $filaments = \print3d\FilamentType::getAllAvailableFilaments();
        $json_array = ["filaments" => []];
        foreach ($filaments as $filament) {
            array_push($json_array["filaments"], $filament->asArray());
        }
        echo json_encode($json_array);
    } elseif($action == "getFilamentsAdmin") {
        $filaments = \print3d\FilamentType::getAllFilaments();
        $json_array = ["filaments" => []];
        foreach ($filaments as $filament) {
            array_push($json_array["filaments"], $filament->asArray());
        }
        echo json_encode($json_array);
    } elseif($action == "getThingiverseImg") {
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
    } elseif($action == "getAllNewOrders") {
        if($user->getRole() == 2) {
            $orders = \print3d\Order::getAllOpenOrders();
            $json_array = ["orders" => []];
            foreach($orders as $order) {
                array_push($json_array["orders"], $order->asArray());
            }
            echo json_encode($json_array);
        } else echo json_encode(["success" => false]);
    } elseif($action == "getAllOrders") {
        if($user->getRole() == 2) {
            $orders = \print3d\Order::getAllOrders();
            $json_array = ["orders" => []];
            foreach($orders as $order) {
                array_push($json_array["orders"], $order->asArray());
            }
            echo json_encode($json_array);
        } else echo json_encode(["success" => false]);
    } elseif($action == "completeOrderAction") {
        $oid = $_GET["oID"];
        if(is_numeric($oid)) {
            $order = \print3d\Order::fromOID($oid);
            $toDo = $_GET["todo"];
            switch ($toDo) {
                case "order":
                    $order->setState(2);
                    $order->saveChanges();
                    break;
                case "reorder":
                    $order->reorder($user);
                    break;
                case "arrived":
                    $order->setState(6);
                    $order->saveChanges();
                    break;
                case "warranty":
                    $order->setState(8);
                    $order->saveChanges();
                    break;
                case "delete":
                    $order->setState(7);
                    $order->saveChanges();
                    break;
            }
            echo json_encode(["success" => true]);
        } else echo json_encode(["success" => false]);
    } elseif($action == "updateOrder") {
        $oid = $_GET["oid"];
        if(is_numeric($oid) && $user->getRole() == 2) {
            $order = \print3d\Order::fromOID($oid);
            $order->setOrderName($_POST["title"]);
            $order->setFilamentType($_POST["fila"]);
            $order->setOrderLink($_POST["url"]);
            $order->setComment($_POST["comment"]);
            $order->setState($_POST["state"]);
            $order->setPrecision($_POST["precision"]);
            $order->setPrintTime($_POST["printtime"]);
            $order->setDateConfirmed(strtotime($_POST["date_confirmed"]));
            $order->setDateCompleted(strtotime($_POST["date_completed"]));
            $order->setMaterialLength($_POST["length"]);
            $order->setCost($_POST["addcost"]);
            $order->setOrderLivestream($_POST["livestream"]);
            $order->saveChanges();
            echo json_encode(["success" => true]);
            exit;
        } else echo json_encode(["success" => false]);
    }