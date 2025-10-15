<?php

namespace App\Middleware;

use App\Utils\JWT;
use App\Utils\Response;

class AuthMiddleware {
    public static function authenticate() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;

        if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            Response::unauthorized('No token provided');
        }

        $token = $matches[1];
        
        try {
            $payload = JWT::decode($token);
            return $payload;
        } catch (\Exception $e) {
            Response::unauthorized($e->getMessage());
        }
    }
}