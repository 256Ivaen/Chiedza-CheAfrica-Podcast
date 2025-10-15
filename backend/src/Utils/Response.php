<?php

namespace App\Utils;

class Response {
    public static function json($data, $status = 200) {
        http_response_code($status);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    public static function success($data = null, $message = 'Success', $status = 200) {
        self::json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $status);
    }

    public static function error($message = 'Error', $status = 400, $errors = null) {
        $response = [
            'success' => false,
            'message' => $message
        ];
        
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        
        self::json($response, $status);
    }

    public static function unauthorized($message = 'Unauthorized') {
        self::error($message, 401);
    }

    public static function forbidden($message = 'Forbidden') {
        self::error($message, 403);
    }

    public static function notFound($message = 'Resource not found') {
        self::error($message, 404);
    }

    public static function created($data = null, $message = 'Resource created successfully') {
        self::success($data, $message, 201);
    }
}