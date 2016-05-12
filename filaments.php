<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 12.05.2016
     * Time: 16:33
     */
    error_reporting(E_ALL && ~E_NOTICE);

    require_once "classes/PDO_MYSQL.php";
    require_once "classes/User.php";
    require_once "classes/FilamentType.php";

    $action = $_GET["action"];
    $user = \print3d\User::checkSession();

    if($action == "newFilament") {
        if ($user->getRole() == 2) {
            \print3d\FilamentType::createNew($_POST["colorname"], $_POST["colorcode"], $_POST["price"], $_POST["saleprice"], $_POST["active"], $_POST["diameter"]);
            echo json_encode(["success" => true]);
        } else echo json_encode(["success" => false]);
    } elseif($action == "getActiveFilaments") {
        $filaments = \print3d\FilamentType::getAllAvailableFilaments();
        $json_array = ["filaments" => []];
        foreach ($filaments as $filament) {
            array_push($json_array["filaments"], $filament->asArray());
        }
        echo json_encode($json_array);
    } elseif($action == "getAllFilaments") {
        if ($user->getRole() == 2) {
            $filaments = \print3d\FilamentType::getAllFilaments();
            $json_array = ["filaments" => []];
            foreach ($filaments as $filament) {
                array_push($json_array["filaments"], $filament->asArray());
            }
            echo json_encode($json_array);
        } else echo json_encode(["success" => false]);
    } elseif($action == "filaDetails") {
        $fID = $_GET["fID"];
        if ($user->getRole() == 2 && is_numeric($fID)) {
            $filament = \print3d\FilamentType::fromFID($fID);
            $json_array = ["filament" => $filament->asArray()];
            echo json_encode($json_array);
        } else echo json_encode(["success" => false]);
    } elseif($action == "updateFila") {
        $fID = $_GET["fid"];
        if ($user->getRole() == 2 && is_numeric($fID)) {
            $filament = \print3d\FilamentType::fromFID($fID);

            $filament->setAvailable($_POST["active"] == "true");
            $filament->setColorcode($_POST["colorcode"]);
            $filament->setColorname($_POST["colorname"]);
            $filament->setPrice($_POST["price"]);
            $filament->setSaleprice($_POST["saleprice"]);
            $filament->setDiameter($_POST["diameter"]);
            $filament->saveChanges();
            
            echo json_encode(["success" => true]);
        } else echo json_encode(["success" => false]);
    }