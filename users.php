<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 28.04.2016
     * Time: 17:12
     */
    error_reporting(E_ALL);

    require_once "classes/PDO_MYSQL.php";
    require_once "classes/User.php";

    $action = $_GET["action"];

    if($action == "login") {

    } elseif($action == "register") {
        $jsonarray = ["success" => 0];
        $username  = $_POST["usrname"];
        $realname  = $_POST["realname"];
        $passwd    = $_POST["passwd"];
        $email     = $_POST["email"];

        if(\print3d\User::doesUserNameExist($username)) {
            $jsonarray["errorcode"] = 1;
            $jsonarray["errormsg"] = "Der Benutzername ist bereits vergeben";
        } elseif($username != null and $realname != null and $passwd != null and $email != null) {
            \print3d\User::createUser($username, $email, $passwd, $realname);
            $jsonarray["success"] = 1;
        } else {
            $jsonarray["errorcode"] = 2;
            $jsonarray["errormsg"] = "Das Formular muss komplett ausgefüllt sein";
        }
        echo json_encode($jsonarray);
    } elseif($action == "validateUsername") {
        echo json_encode(["success" => \print3d\User::doesUserNameExist($_GET["username"]) ? 0:1]);
    }