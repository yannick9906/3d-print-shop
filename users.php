<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 30.04.2016
     * Time: 18:31
     */

    //error_reporting(E_ALL);

    require_once "classes/PDO_MYSQL.php";
    require_once "classes/User.php";
    require_once "classes/Order.php";
    require_once "classes/FilamentType.php";

    $action = $_GET["action"];
    $user = \print3d\User::checkSession();

    if($action == "getOwnUserData") {
        $json_array = ["user" => $user->asArray()];
        echo json_encode($json_array);
    } else if($action == "updateEmail") {
        $json_array = ["success" => false];
        if($_POST["emails"] != "" and $_POST["email"] != "") {
            $user->setEmail($_POST["email"]);
            $user->setReceivingEmails($_POST["emails"] == "true");
            $user->saveChanges();
            $json_array["success"] = true;
        } else {
            $json_array["errorcode"] = 2;
            $jsonarray["errormsg"] = "Das Formular muss komplett ausgefüllt sein";
        }
        echo json_encode($json_array);
    } else if($action == "updatePass") {
        $json_array = ["success" => false];
        if($_POST["passwd"] != "") {
            $user->setPasswdHash($_POST["passwd"]);
            $user->saveChanges();
            $json_array["success"] = true;
        } else {
            $json_array["errorcode"] = 2;
            $jsonarray["errormsg"] = "Das Formular muss komplett ausgefüllt sein";
        }
        echo json_encode($json_array);
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
    } else if($action == "getThingiverseImg") {
        $link = $_GET["link"];
        $html = file_get_contents($link);

        $doc = new DOMDocument();
        @$doc->loadHTML($html);

        $tags = $doc->getElementsByTagName('img');

        foreach ($tags as $tag) {
            if(strpos($tag->getAttribute('src'), "renders") && !(strpos($tag->getAttribute('src'), "thumb_small"))) {
                echo json_encode(["link" => $tag->getAttribute("src")]);
                exit;
            }
        }
    } else if($action == "setPushMessaging") {
        require_once "classes/passwd.php";
        require_once "vendor/autoload.php";

        $endpoint = json_decode($_POST["endpoint"]);
        $user->addEndpoint($endpoint);
        $user->saveChanges();
    }