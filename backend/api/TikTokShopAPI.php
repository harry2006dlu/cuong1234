<?php
class TikTokShopAPI {
    private $app_key;
    private $app_secret;
    private $access_token;
    private $base_url = "https://open-api.tiktokglobalshop.com";

    public function __construct($app_key, $app_secret, $access_token) {
        $this->app_key = $app_key;
        $this->app_secret = $app_secret;
        $this->access_token = $access_token;
    }

    public function getProducts($params = []) {
        $endpoint = "/api/products/search";
        return $this->makeRequest('GET', $endpoint, $params);
    }

    private function makeRequest($method, $endpoint, $params = []) {
        $timestamp = time();
        $params['app_key'] = $this->app_key;
        $params['timestamp'] = $timestamp;
        $params['access_token'] = $this->access_token;

        $sign = $this->generateSign($params);
        $params['sign'] = $sign;

        $url = $this->base_url . $endpoint . '?' . http_build_query($params);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }

    private function generateSign($params) {
        ksort($params);
        $string = $this->app_secret;
        foreach ($params as $key => $value) {
            $string .= "$key$value";
        }
        $string .= $this->app_secret;
        return hash('sha256', $string);
    }
}
?>
