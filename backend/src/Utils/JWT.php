<?php

namespace App\Utils;

class JWT {
    private static $secret;
    private static $expiry;

    public static function init() {
        self::$secret = $_ENV['JWT_SECRET'];
        self::$expiry = (int)$_ENV['JWT_EXPIRY'];
    }

    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }

    public static function encode($payload) {
        self::init();
        
        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];

        $payload['iat'] = time();
        $payload['exp'] = time() + self::$expiry;

        $headerEncoded = self::base64UrlEncode(json_encode($header));
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));

        $signature = hash_hmac(
            'sha256',
            "$headerEncoded.$payloadEncoded",
            self::$secret,
            true
        );
        $signatureEncoded = self::base64UrlEncode($signature);

        return "$headerEncoded.$payloadEncoded.$signatureEncoded";
    }

    public static function decode($token) {
        self::init();
        
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            throw new \Exception('Invalid token format');
        }

        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;

        $signature = self::base64UrlDecode($signatureEncoded);
        $expectedSignature = hash_hmac(
            'sha256',
            "$headerEncoded.$payloadEncoded",
            self::$secret,
            true
        );

        if (!hash_equals($signature, $expectedSignature)) {
            throw new \Exception('Invalid token signature');
        }

        $payload = json_decode(self::base64UrlDecode($payloadEncoded), true);

        if (!isset($payload['exp']) || $payload['exp'] < time()) {
            throw new \Exception('Token has expired');
        }

        return $payload;
    }

    public static function verify($token) {
        try {
            return self::decode($token);
        } catch (\Exception $e) {
            return false;
        }
    }
}