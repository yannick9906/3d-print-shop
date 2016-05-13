<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 13.05.2016
     * Time: 12:02
     */

namespace print3d {


    /**
     * @param  \print3d\Order $order
     * @param \print3d\User $user
     * @return string
     */
    function getEmailTextPrice($order, $user) {
        $date = date("d. M Y - H:i:s",$order->getDateCreated());
        $cost = money_format("%i", $order->getTotalCost()/100);
        return <<<END
--b1_ad31a77529300ba7014d73b6127af5d2
Content-Type: text/html; charset="UTF-8"
Content-Transfer-Encoding: 8bit
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<html>
    <head>
        <title>Yannicks 3D Drucke</title>
        
                
    </head>
    <body style="background-color: #ff9800;" bgcolor="#ff9800">
<style type="text/css">
.btn:hover { box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15) !important; }
.btn:hover { background-color: #2bbbad !important; }
.btn-large:hover { background-color: #2bbbad !important; }
></style>
        <script type="application/ld+json">
        {
            "@context": "http://schema.org",
            "@type": "EmailMessage",
            "potentialAction": {
                "@type": "ConfirmAction",
                "name": "Preisangebot annehmen",
                "handler": {
                    "@type": "HttpActionHandler",
                    "url": "https://3d.yannickfelix.tk/new/email.php?action=accept&oid={$order->getOID()}"
                }
            },
            "description": "Preisangebot: {$cost} &euro;"
        }
        </script>
        <div style="position: absolute; top: 20px; left: 20%; right: 20%; background-color: white; text-align: center; border-radius: 2px; box-shadow: 0px 5px 10px rgba(0,0,0,0.3); font-family: 'Roboto'; font-size: 20px; font-weight: bold; padding: 10px;" align="center">
            Yannicks 3D Drucke
        </div>
        <div style="position: absolute; top: 80px; left: 20%; right: 20%; background-color: white; text-align: center; border-radius: 2px; box-shadow: 0px 5px 10px rgba(0,0,0,0.3); font-family: 'Roboto'; font-size: 20px; padding: 10px;" align="center">
            Ein Preisangebot ist verf&uuml;gbar
        </div>
        <div style="position: absolute; top: 140px; left: 20%; right: 20%; background-color: white; border-radius: 2px; box-shadow: 0px 5px 10px rgba(0,0,0,0.3); font-family: 'Roboto'; font-size: 16px; font-weight: bold; padding: 10px;">
            Deine Bestellung
            <p style="font-size: 15px; font-weight: normal;">
                Name: {$order->getOrderName()}<br>
                Preis: {$cost} &euro;<br>
                <br>
                Bestellt am: {$date}
            </p>
            <a href="http://3d.yannickfelix.tk/new/appLogin.html" style="box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); border-radius: 2px; display: inline-block; height: 36px; line-height: 36px; outline: 0; text-transform: uppercase; vertical-align: middle; -webkit-tap-highlight-color: transparent; text-decoration: none; color: #fff; background-color: #2196F3 !important; text-align: center; letter-spacing: .5px; transition: .2s ease-out; cursor: pointer; padding: 0 2rem; border: none;">Bestellung ansehen</a>
        </div>
    </body>
</html>

--b1_ad31a77529300ba7014d73b6127af5d2--
END;

    }

    /**
     * @param  \print3d\Order $order
     * @param \print3d\User $user
     * @return string
     */
    function getEmailTextPrint($order, $user) {
        $date = date("d. M Y - H:i:s",$order->getDateCreated());
        $cost = money_format("%i", $order->getTotalCost()/100);
        return <<<END
--b1_ad31a77529300ba7014d73b6127af5d2
Content-Type: text/html; charset="UTF-8"
Content-Transfer-Encoding: 8bit
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<html>
    <head>
        <title>Yannicks 3D Drucke</title>
        
                
    </head>
    <body style="background-color: #ff9800;" bgcolor="#ff9800">
<style type="text/css">
.btn:hover { box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15) !important; }
.btn:hover { background-color: #2bbbad !important; }
.btn-large:hover { background-color: #2bbbad !important; }
></style>
        <div style="position: absolute; top: 20px; left: 20%; right: 20%; background-color: white; text-align: center; border-radius: 2px; box-shadow: 0px 5px 10px rgba(0,0,0,0.3); font-family: 'Roboto'; font-size: 20px; font-weight: bold; padding: 10px;" align="center">
            Yannicks 3D Drucke
        </div>
        <div style="position: absolute; top: 80px; left: 20%; right: 20%; background-color: white; text-align: center; border-radius: 2px; box-shadow: 0px 5px 10px rgba(0,0,0,0.3); font-family: 'Roboto'; font-size: 20px; padding: 10px;" align="center">
            Deine Bestellung druckt gerade
        </div>
        <div style="position: absolute; top: 140px; left: 20%; right: 20%; background-color: white; border-radius: 2px; box-shadow: 0px 5px 10px rgba(0,0,0,0.3); font-family: 'Roboto'; font-size: 16px; font-weight: bold; padding: 10px;">
            Deine Bestellung
            <p style="font-size: 15px; font-weight: normal;">
                Name: {$order->getOrderName()}<br>
                Preis: {$cost} &euro;<br>
                <br>
                Bestellt am: {$date}
            </p>
            <a href="http://3d.yannickfelix.tk/new/appLogin.html" style="box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); border-radius: 2px; display: inline-block; height: 36px; line-height: 36px; outline: 0; text-transform: uppercase; vertical-align: middle; -webkit-tap-highlight-color: transparent; text-decoration: none; color: #fff; background-color: #2196F3 !important; text-align: center; letter-spacing: .5px; transition: .2s ease-out; cursor: pointer; padding: 0 2rem; border: none;">Bestellung ansehen</a>
        </div>
    </body>
</html>

--b1_ad31a77529300ba7014d73b6127af5d2--
END;

    }

    /**
     * @param  \print3d\Order $order
     * @param \print3d\User $user
     * @return string
     */
    function getEmailTextFail($order, $user) {
        $date = date("d. M Y - H:i:s",$order->getDateCreated());
        $cost = money_format("%i", $order->getTotalCost()/100);
        return <<<END
--b1_ad31a77529300ba7014d73b6127af5d2
Content-Type: text/html; charset="UTF-8"
Content-Transfer-Encoding: 8bit
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<html>
    <head>
        <title>Yannicks 3D Drucke</title>
        
                
    </head>
    <body style="background-color: #ff9800;" bgcolor="#ff9800">
<style type="text/css">
.btn:hover { box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15) !important; }
.btn:hover { background-color: #2bbbad !important; }
.btn-large:hover { background-color: #2bbbad !important; }
></style>
        <div style="position: absolute; top: 20px; left: 20%; right: 20%; background-color: white; text-align: center; border-radius: 2px; box-shadow: 0px 5px 10px rgba(0,0,0,0.3); font-family: 'Roboto'; font-size: 20px; font-weight: bold; padding: 10px;" align="center">
            Yannicks 3D Drucke
        </div>
        <div style="position: absolute; top: 80px; left: 20%; right: 20%; background-color: white; text-align: center; border-radius: 2px; box-shadow: 0px 5px 10px rgba(0,0,0,0.3); font-family: 'Roboto'; font-size: 20px; padding: 10px;" align="center">
            Deine Bestellung wurde abgelehnt, da sie nicht druckbar ist. Das tut uns leid :/
        </div>
        <div style="position: absolute; top: 140px; left: 20%; right: 20%; background-color: white; border-radius: 2px; box-shadow: 0px 5px 10px rgba(0,0,0,0.3); font-family: 'Roboto'; font-size: 16px; font-weight: bold; padding: 10px;">
            Deine Bestellung
            <p style="font-size: 15px; font-weight: normal;">
                Name: {$order->getOrderName()}<br>
                Preis: {$cost} &euro;<br>
                <br>
                Bestellt am: {$date}
            </p>
            <a href="http://3d.yannickfelix.tk/new/appLogin.html" style="box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); border-radius: 2px; display: inline-block; height: 36px; line-height: 36px; outline: 0; text-transform: uppercase; vertical-align: middle; -webkit-tap-highlight-color: transparent; text-decoration: none; color: #fff; background-color: #2196F3 !important; text-align: center; letter-spacing: .5px; transition: .2s ease-out; cursor: pointer; padding: 0 2rem; border: none;">Bestellung ansehen</a>
        </div>
    </body>
</html>

--b1_ad31a77529300ba7014d73b6127af5d2--
END;

    }
}