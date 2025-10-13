<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/../src/';
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    
    if (file_exists($file)) {
        require $file;
    }
});

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

use App\Utils\Response;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Controllers\AuthController;
use App\Controllers\BlogController;
use App\Controllers\CommentController;
use App\Controllers\ReactionController;
use App\Controllers\UserController;

try {
    $db = Database::getInstance()->getConnection();
} catch (Exception $e) {
    Response::error('Database connection failed', 500);
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// For api.chiedzacheafrica.com, we don't need to remove any prefixes
// The URI will be exactly what comes after the domain
$uri = rtrim($uri, '/');

$input = file_get_contents('php://input');
$data = json_decode($input, true) ?? [];

$queryParams = $_GET;

$uriParts = explode('/', trim($uri, '/'));
$resource = $uriParts[0] ?? '';

// Debug logging
error_log("API Request: " . $method . " " . $uri);
error_log("URI Parts: " . json_encode($uriParts));

$authController = new AuthController($db);
$blogController = new BlogController($db);
$commentController = new CommentController($db);
$reactionController = new ReactionController($db);
$userController = new UserController($db);

// PUBLIC ROUTES - No authentication required
if ($method === 'POST' && $resource === 'auth' && ($uriParts[1] ?? '') === 'login') {
    error_log("Processing login request");
    $authController->login($data);
    exit;
}

if ($method === 'POST' && $resource === 'auth' && ($uriParts[1] ?? '') === 'register') {
    error_log("Processing register request");
    // Temporary bypass for registration
    $authController->register($data, ['role' => 'admin']);
    exit;
}

if ($method === 'GET' && $resource === 'blogs' && !isset($uriParts[1])) {
    error_log("Processing get all blogs");
    $blogController->getAll($queryParams);
    exit;
}

if ($method === 'GET' && $resource === 'blogs' && isset($uriParts[1]) && is_numeric($uriParts[1]) && !isset($uriParts[2])) {
    error_log("Processing get blog by ID: " . $uriParts[1]);
    $identifier = $_SERVER['REMOTE_ADDR'] . '_' . ($_SERVER['HTTP_USER_AGENT'] ?? '');
    $blogController->getById($uriParts[1], $identifier);
    exit;
}

if ($method === 'GET' && $resource === 'blogs' && isset($uriParts[1]) && ($uriParts[2] ?? '') === 'comments') {
    error_log("Processing get blog comments: " . $uriParts[1]);
    $commentController->getByBlogId($uriParts[1]);
    exit;
}

if ($method === 'POST' && $resource === 'blogs' && isset($uriParts[1]) && ($uriParts[2] ?? '') === 'comments' && !isset($uriParts[3])) {
    error_log("Processing create comment for blog: " . $uriParts[1]);
    $commentController->create($uriParts[1], $data);
    exit;
}

if ($method === 'GET' && $resource === 'blogs' && isset($uriParts[1]) && ($uriParts[2] ?? '') === 'reactions') {
    error_log("Processing get reactions for blog: " . $uriParts[1]);
    $identifier = $queryParams['identifier'] ?? null;
    $reactionController->getByBlogId($uriParts[1], $identifier);
    exit;
}

if ($method === 'POST' && $resource === 'blogs' && isset($uriParts[1]) && ($uriParts[2] ?? '') === 'reactions') {
    error_log("Processing add reaction for blog: " . $uriParts[1]);
    $reactionController->add($uriParts[1], $data);
    exit;
}

if ($method === 'DELETE' && $resource === 'blogs' && isset($uriParts[1]) && ($uriParts[2] ?? '') === 'reactions') {
    error_log("Processing remove reaction for blog: " . $uriParts[1]);
    $reactionController->remove($uriParts[1], $data);
    exit;
}

if ($method === 'PUT' && $resource === 'views' && isset($uriParts[1])) {
    error_log("Processing update view duration: " . $uriParts[1]);
    $blogController->updateViewDuration($uriParts[1], $data);
    exit;
}

if ($method === 'GET' && $resource === 'health') {
    error_log("Processing health check");
    Response::success(['status' => 'healthy', 'timestamp' => date('Y-m-d H:i:s')]);
    exit;
}

error_log("No public route matched, checking protected routes");

// PROTECTED ROUTES - Authentication required
try {
    error_log("Attempting authentication...");
    $user = AuthMiddleware::authenticate();
    error_log("Authentication successful for user: " . $user['email'] ?? 'unknown');
} catch (Exception $e) {
    error_log("Authentication failed: " . $e->getMessage());
    Response::error('Authentication required: ' . $e->getMessage(), 401);
    exit;
}

// Handle protected routes
if ($method === 'POST' && $resource === 'auth' && ($uriParts[1] ?? '') === 'change-password') {
    $authController->changePassword($data, $user);
    exit;
}

if ($method === 'GET' && $resource === 'auth' && ($uriParts[1] ?? '') === 'profile') {
    $authController->getProfile($user);
    exit;
}

if ($method === 'POST' && $resource === 'blogs' && !isset($uriParts[1])) {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $blogController->create($data, $user);
    exit;
}

if ($method === 'PUT' && $resource === 'blogs' && isset($uriParts[1]) && is_numeric($uriParts[1])) {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $blogController->update($uriParts[1], $data, $user);
    exit;
}

if ($method === 'DELETE' && $resource === 'blogs' && isset($uriParts[1]) && is_numeric($uriParts[1]) && !isset($uriParts[2])) {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $blogController->delete($uriParts[1], $user);
    exit;
}

if ($method === 'PATCH' && $resource === 'blogs' && isset($uriParts[1]) && ($uriParts[2] ?? '') === 'visibility') {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $blogController->toggleVisibility($uriParts[1], $user);
    exit;
}

if ($method === 'POST' && $resource === 'blogs' && isset($uriParts[1]) && ($uriParts[2] ?? '') === 'comments' && isset($uriParts[3]) && ($uriParts[4] ?? '') === 'reply') {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $commentController->createAdminReply($uriParts[1], $uriParts[3], $data, $user);
    exit;
}

if ($method === 'DELETE' && $resource === 'comments' && isset($uriParts[1])) {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $commentController->delete($uriParts[1], $user);
    exit;
}

if ($method === 'GET' && $resource === 'users') {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $userController->getAll($user);
    exit;
}

if ($method === 'DELETE' && $resource === 'users' && isset($uriParts[1])) {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $userController->delete($uriParts[1], $user);
    exit;
}

error_log("No route matched: " . $method . " " . $uri);
Response::notFound('Endpoint not found');