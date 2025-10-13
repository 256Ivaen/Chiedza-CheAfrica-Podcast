<?php

error_reporting(E_ALL);
ini_set('display_errors', $_ENV['APP_ENV'] === 'development' ? '1' : '0');

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
$uri = str_replace('/backend/public', '', $uri);
$uri = rtrim($uri, '/');

$input = file_get_contents('php://input');
$data = json_decode($input, true) ?? [];

$queryParams = $_GET;

$uriParts = explode('/', trim($uri, '/'));
$resource = $uriParts[0] ?? '';

$authController = new AuthController($db);
$blogController = new BlogController($db);
$commentController = new CommentController($db);
$reactionController = new ReactionController($db);
$userController = new UserController($db);

// PUBLIC ROUTES - No authentication required
$publicRoutes = [
    // Auth routes
    ['method' => 'POST', 'path' => 'auth/login'],
    ['method' => 'POST', 'path' => 'auth/register'],
    
    // Blog routes
    ['method' => 'GET', 'path' => 'blogs'],
    ['method' => 'GET', 'path' => 'blogs/{id}'],
    ['method' => 'GET', 'path' => 'blogs/{id}/comments'],
    ['method' => 'POST', 'path' => 'blogs/{id}/comments'],
    ['method' => 'GET', 'path' => 'blogs/{id}/reactions'],
    ['method' => 'POST', 'path' => 'blogs/{id}/reactions'],
    ['method' => 'DELETE', 'path' => 'blogs/{id}/reactions'],
    ['method' => 'PUT', 'path' => 'views/{id}'],
    
    // Health check
    ['method' => 'GET', 'path' => 'health'],
];

// Check if current request matches any public route
$isPublicRoute = false;
foreach ($publicRoutes as $route) {
    $routeParts = explode('/', $route['path']);
    
    if ($route['method'] === $method && count($routeParts) === count($uriParts)) {
        $match = true;
        for ($i = 0; $i < count($routeParts); $i++) {
            if (strpos($routeParts[$i], '{') === false && $routeParts[$i] !== $uriParts[$i]) {
                $match = false;
                break;
            }
        }
        if ($match) {
            $isPublicRoute = true;
            break;
        }
    }
}

// Handle public routes
if ($isPublicRoute) {
    switch (true) {
        case ($method === 'POST' && $resource === 'auth' && ($uriParts[1] ?? '') === 'login'):
            $authController->login($data);
            exit;
            
        case ($method === 'POST' && $resource === 'auth' && ($uriParts[1] ?? '') === 'register'):
            $authController->register($data);
            exit;
            
        case ($method === 'GET' && $resource === 'blogs' && !isset($uriParts[1])):
            $blogController->getAll($queryParams);
            exit;
            
        case ($method === 'GET' && $resource === 'blogs' && isset($uriParts[1]) && is_numeric($uriParts[1]) && !isset($uriParts[2])):
            $identifier = $_SERVER['REMOTE_ADDR'] . '_' . ($_SERVER['HTTP_USER_AGENT'] ?? '');
            $blogController->getById($uriParts[1], $identifier);
            exit;
            
        case ($method === 'GET' && $resource === 'blogs' && isset($uriParts[1]) && ($uriParts[2] ?? '') === 'comments'):
            $commentController->getByBlogId($uriParts[1]);
            exit;
            
        case ($method === 'POST' && $resource === 'blogs' && isset($uriParts[1]) && ($uriParts[2] ?? '') === 'comments' && !isset($uriParts[3])):
            $commentController->create($uriParts[1], $data);
            exit;
            
        case ($method === 'GET' && $resource === 'blogs' && isset($uriParts[1]) && ($uriParts[2] ?? '') === 'reactions'):
            $identifier = $queryParams['identifier'] ?? null;
            $reactionController->getByBlogId($uriParts[1], $identifier);
            exit;
            
        case ($method === 'POST' && $resource === 'blogs' && isset($uriParts[1]) && ($uriParts[2] ?? '') === 'reactions'):
            $reactionController->add($uriParts[1], $data);
            exit;
            
        case ($method === 'DELETE' && $resource === 'blogs' && isset($uriParts[1]) && ($uriParts[2] ?? '') === 'reactions'):
            $reactionController->remove($uriParts[1], $data);
            exit;
            
        case ($method === 'PUT' && $resource === 'views' && isset($uriParts[1])):
            $blogController->updateViewDuration($uriParts[1], $data);
            exit;
            
        case ($method === 'GET' && $resource === 'health'):
            Response::success(['status' => 'healthy', 'timestamp' => date('Y-m-d H:i:s')]);
            exit;
    }
}

// PROTECTED ROUTES - Authentication required
try {
    $user = AuthMiddleware::authenticate();
} catch (Exception $e) {
    Response::error('Authentication required: ' . $e->getMessage(), 401);
    exit;
}

// Handle protected routes
switch (true) {
    case ($method === 'POST' && $resource === 'auth' && ($uriParts[1] ?? '') === 'change-password'):
        $authController->changePassword($data, $user);
        exit;
        
    case ($method === 'GET' && $resource === 'auth' && ($uriParts[1] ?? '') === 'profile'):
        $authController->getProfile($user);
        exit;
        
    case ($method === 'POST' && $resource === 'blogs' && !isset($uriParts[1])):
        RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
        $blogController->create($data, $user);
        exit;
        
    case ($method === 'PUT' && $resource === 'blogs' && isset($uriParts[1]) && is_numeric($uriParts[1])):
        RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
        $blogController->update($uriParts[1], $data, $user);
        exit;
        
    case ($method === 'DELETE' && $resource === 'blogs' && isset($uriParts[1]) && is_numeric($uriParts[1]) && !isset($uriParts[2])):
        RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
        $blogController->delete($uriParts[1], $user);
        exit;
        
    case ($method === 'PATCH' && $resource === 'blogs' && isset($uriParts[1]) && ($uriParts[2] ?? '') === 'visibility'):
        RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
        $blogController->toggleVisibility($uriParts[1], $user);
        exit;
        
    case ($method === 'POST' && $resource === 'blogs' && isset($uriParts[1]) && ($uriParts[2] ?? '') === 'comments' && isset($uriParts[3]) && ($uriParts[4] ?? '') === 'reply'):
        RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
        $commentController->createAdminReply($uriParts[1], $uriParts[3], $data, $user);
        exit;
        
    case ($method === 'DELETE' && $resource === 'comments' && isset($uriParts[1])):
        RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
        $commentController->delete($uriParts[1], $user);
        exit;
        
    case ($method === 'GET' && $resource === 'users'):
        RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
        $userController->getAll($user);
        exit;
        
    case ($method === 'DELETE' && $resource === 'users' && isset($uriParts[1])):
        RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
        $userController->delete($uriParts[1], $user);
        exit;
}

Response::notFound('Endpoint not found');