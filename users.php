<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 28.04.2016
     * Time: 17:12
     */

    require_once "classes/PDO_MYSQL.php";
    require_once "classes/User.php";

    $action = $_GET["action"];

    if($action == "login") {

    } elseif($action == "register") {
        $jsonarray = [];
        $username  = $_POST["usrname"];
        $realname  = $_POST["realname"];
        $passwd    = $_POST["passwd"];
        $email     = $_POST["email"];

        if(\print3d\User::doesUserNameExist($username)) {
            $jsonarray["errorcode"] = 1;
            $jsonarray["errormsg"] = "Der Benutzername ist bereits vergeben";
        } elseif($username != null and $realname != null and $passwd != null and $email != null) {
            \print3d\User::createUser($usrname, $email, $passwd, $realname);
        } else {
            $jsonarray["errorcode"] = 2;
            $jsonarray["errormsg"] = "Das Formular muss komplett ausgefüllt sein";
        }
    }