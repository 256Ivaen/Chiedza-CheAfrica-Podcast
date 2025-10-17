<?php

namespace App\Utils;

class GoogleAuth {
    private $credentials;
    private $accessToken;
    private $tokenExpiry;

    public function __construct($credentialsPath) {
        if (!file_exists($credentialsPath)) {
            throw new \Exception('Google Analytics credentials file not found at: ' . $credentialsPath);
        }

        $this->credentials = json_decode(file_get_contents($credentialsPath), true);
        
        if (!$this->credentials) {
            throw new \Exception('Invalid credentials file format');
        }
    }

    /**
     * Get access token (generates new one if expired)
     */
    public function getAccessToken() {
        // Check if we have a valid cached token
        if ($this->accessToken && $this->tokenExpiry && time() < $this->tokenExpiry) {
            return $this->accessToken;
        }

        // Generate new JWT token
        $jwt = $this->createJWT();
        
        // Exchange JWT for access token
        $this->accessToken = $this->exchangeJWTForAccessToken($jwt);
        $this->tokenExpiry = time() + 3000; // Token valid for ~50 minutes
        
        return $this->accessToken;
    }

    /**
     * Create JWT (JSON Web Token) for authentication
     */
    private function createJWT() {
        $header = [
            'alg' => 'RS256',
            'typ' => 'JWT'
        ];

        $now = time();
        $claim = [
            'iss' => $this->credentials['client_email'],
            'scope' => 'https://www.googleapis.com/auth/analytics.readonly',
            'aud' => 'https://oauth2.googleapis.com/token',
            'exp' => $now + 3600,
            'iat' => $now
        ];

        $headerEncoded = $this->base64UrlEncode(json_encode($header));
        $claimEncoded = $this->base64UrlEncode(json_encode($claim));
        
        $signature = '';
        $dataToSign = $headerEncoded . '.' . $claimEncoded;
        
        // Sign with private key
        $privateKey = openssl_pkey_get_private($this->credentials['private_key']);
        openssl_sign($dataToSign, $signature, $privateKey, 'SHA256');
        openssl_free_key($privateKey);
        
        $signatureEncoded = $this->base64UrlEncode($signature);
        
        return $dataToSign . '.' . $signatureEncoded;
    }

    /**
     * Exchange JWT for access token
     */
    private function exchangeJWTForAccessToken($jwt) {
        $ch = curl_init('https://oauth2.googleapis.com/token');
        
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query([
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion' => $jwt
            ]),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded'
            ]
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new \Exception('Failed to get access token: ' . $response);
        }
        
        $data = json_decode($response, true);
        
        if (!isset($data['access_token'])) {
            throw new \Exception('Access token not found in response');
        }
        
        return $data['access_token'];
    }

    /**
     * Base64 URL encode
     */
    private function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}