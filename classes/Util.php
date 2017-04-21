<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 06.09.2016
     * Time: 20:17
     */

    namespace print3d;


    use Minishlink\WebPush\WebPush;

    class Util {

        /**
         * @param $secs int
         * @return string
         */
        public static function seconds_to_time($secs) {
            $dt = new \DateTime('@' . $secs, new \DateTimeZone('UTC'));
            $array = ['days'    => $dt->format('z'),
                      'hours'   => $dt->format('G'),
                      'minutes' => $dt->format('i'),
                      'seconds' => $dt->format('s')];
            if ($array["days"] == 1) return $array["days"] . " Tag " . $array["hours"] . "h " . $array["minutes"] . "m " . $array["seconds"] . "s";
            else return $array["days"] . " Tage " . $array["hours"] . "h " . $array["minutes"] . "m " . $array["seconds"] . "s";
        }

        public static function getThingiverse($link) {
            $html = file_get_contents($link);

            $doc = new \DOMDocument();
            $doc->loadHTML($html);
            $tags = $doc->getElementsByTagName('img');

            foreach ($tags as $tag) {
                if (strpos($tag->getAttribute('src'), "renders") && !(strpos($tag->getAttribute('src'), "thumb_small"))) {
                    $src = $tag->getAttribute("src");
                    return $src;
                }
            }
        }

        /**
         * @param User  $user
         * @param Order $order
         */
        public static function sendPushNotifications($user, $order) {
            $webPush = new WebPush(getPushVAPIDAuth());
            $defaultOptions = [
                'TTL'       => 300, // defaults to 4 weeks
                'urgency'   => 'normal', // protocol defaults to "normal"
                'topic'     => 'new_event', // not defined by default,
                'batchSize' => 200, // defaults to 1000
            ];
            $webPush->setDefaultOptions($defaultOptions);

            $endpoints = $user->getEndpoints();
            if (is_array($endpoints))
                foreach ($endpoints as $endpoint) {
                    $date_completed = $order->getDateCompleted() != 0 ? date("d. M Y - H:i:s", $order->getDateCompleted()) : "Warte auf Einschätzung";

                    $payload = json_encode([
                        "info"          => "statechange",
                        "orderID"       => $order->getOID(),
                        "orderName"     => $order->getOrderName(),
                        "orderPrice"    => str_replace(" EUR", "", money_format("%i", $order->getTotalCost() / 100)),
                        "orderState"    => $order->getState(),
                        "dateCompleted" => $date_completed
                    ]);
                    // or for one notification
                    $webPush->sendNotification($endpoint->endpoint, $payload, $endpoint->keys->p256dh, $endpoint->keys->auth, true, ['TTL' => 5000]);
                }
        }

        /**
         * @param $endpoint
         */
        public static function sendPushNotification($endpoint) {

            $webPush = new WebPush(getPushVAPIDAuth());
            $defaultOptions = [
                'TTL'       => 300, // defaults to 4 weeks
                'urgency'   => 'normal', // protocol defaults to "normal"
                'topic'     => 'new_event', // not defined by default,
                'batchSize' => 200, // defaults to 1000
            ];
            $webPush->setDefaultOptions($defaultOptions);

            $payload = json_encode([
                "info"  => "custom",
                "title" => "Push Benachrichtigung",
                "body"  => "Erfolgreich eingerichtet."
            ]);
            // or for one notification
            $webPush->sendNotification($endpoint->endpoint, $payload, $endpoint->keys->p256dh, $endpoint->keys->auth, true, ['TTL' => 5000]);
        }
    }