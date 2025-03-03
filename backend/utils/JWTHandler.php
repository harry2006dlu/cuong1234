<?php
class JWTHandler {
    private $secret_key = "your_secret_key"; // Change this to a secure key
    private $algorithm = 'HS256';
    private $token_duration = 3600; // 1 hour

    public function generateToken($data) {
        $header = json_encode([
            'typ' => 'JWT',
            'alg' => $this->algorithm
        ]);

        $payload = json_encode([
            'user_data' => $data,
            'exp' => time() + $this->token_duration
        ]);

        $base64UrlHeader = $this->base64UrlEncode($header);
        $base64UrlPayload = $this->base64UrlEncode($payload);
        $signature = hash_hmac('sha256', 
            $base64UrlHeader . "." . $base64UrlPayload, 
            $this->secret_key, 
            true
        );
        $base64UrlSignature = $this->base64UrlEncode($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public function validateToken($token) {
        $parts = explode('.', $token);
        
        if (count($parts) != 3) {
            return false;
        }

        $header = $this->base64UrlDecode($parts[0]);
        $payload = $this->base64UrlDecode($parts[1]);
        $signature = $this->base64UrlDecode($parts[2]);

        $headerData = json_decode($header, true);
        $payloadData = json_decode($payload, true);

        // Check expiration
        if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
            return false;
        }

        // Verify signature
        $verifySignature = hash_hmac('sha256', 
            $parts[0] . "." . $parts[1], 
            $this->secret_key, 
            true
        );

        return hash_equals($signature, $verifySignature);
    }

    private function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }
}
?>
