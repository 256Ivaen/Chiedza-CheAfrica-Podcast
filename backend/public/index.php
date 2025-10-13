<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log everything
error_log("=== NEW REQUEST START ===");
error_log("REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD']);
error_log("REQUEST_URI: " . ($_SERVER['REQUEST_URI'] ?? ''));
error_log("SCRIPT_NAME: " . ($_SERVER['SCRIPT_NAME'] ?? ''));
error_log("PHP_SELF: " . ($_SERVER['PHP_SELF'] ?? ''));

// Simple response to test if we're reaching the right file
if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($_SERVER['REQUEST_URI'], '/auth/login') !== false) {
    error_log("LOGIN REQUEST DETECTED - SENDING SUCCESS RESPONSE");
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'message' => 'DEBUG: Reached login endpoint successfully',
        'debug' => [
            'uri' => $_SERVER['REQUEST_URI'],
            'method' => $_SERVER['REQUEST_METHOD'],
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ]);
    exit;
}

// If we get here, show debug info
error_log("REQUEST DID NOT MATCH LOGIN ENDPOINT");
header('Content-Type: application/json');
http_response_code(404);
echo json_encode([
    'success' => false,
    'message' => 'DEBUG: Endpoint not matched',
    'debug' => [
        'uri' => $_SERVER['REQUEST_URI'],
        'method' => $_SERVER['REQUEST_METHOD'],
        'server_info' => [
            'SCRIPT_NAME' => $_SERVER['SCRIPT_NAME'] ?? '',
            'PHP_SELF' => $_SERVER['PHP_SELF'] ?? '',
            'PATH_INFO' => $_SERVER['PATH_INFO'] ?? ''
        ]
    ]
]);