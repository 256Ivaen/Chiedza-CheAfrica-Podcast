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
use App\Controllers\UploadController;
use App\Controllers\ContactController;

try {
    $db = Database::getInstance()->getConnection();
} catch (Exception $e) {
    Response::error('Database connection failed: ' . $e->getMessage(), 500);
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$uri = parse_url($uri, PHP_URL_PATH);
$uri = preg_replace('#^/api#', '', $uri);
$uri = rtrim($uri, '/');
if (empty($uri)) {
    $uri = '/';
}

// Handle form data for file uploads
$input = file_get_contents('php://input');
$data = json_decode($input, true) ?? [];
$queryParams = $_GET;

// For file uploads, merge POST data
if ($method === 'POST' && !empty($_POST)) {
    $data = array_merge($data, $_POST);
}

$authController = new AuthController($db);
$blogController = new BlogController($db);
$commentController = new CommentController($db);
$reactionController = new ReactionController($db);
$userController = new UserController($db);
$uploadController = new UploadController();
$contactController = new ContactController();

// Public routes
if ($method === 'GET' && $uri === '/health') {
    Response::success(['status' => 'healthy', 'timestamp' => date('Y-m-d H:i:s')]);
}

if ($method === 'POST' && $uri === '/auth/login') {
    $authController->login($data);
}

if ($method === 'GET' && $uri === '/blogs') {
    $blogController->getAll($queryParams);
}

if ($method === 'GET' && preg_match('#^/blogs/(\d+)$#', $uri, $matches)) {
    $identifier = $_SERVER['REMOTE_ADDR'] . '_' . ($_SERVER['HTTP_USER_AGENT'] ?? '');
    $blogController->getById($matches[1], $identifier);
}

if ($method === 'GET' && preg_match('#^/blogs/(\d+)/comments$#', $uri, $matches)) {
    $commentController->getByBlogId($matches[1]);
}

if ($method === 'POST' && preg_match('#^/blogs/(\d+)/comments$#', $uri, $matches)) {
    $commentController->create($matches[1], $data);
}

if ($method === 'GET' && preg_match('#^/blogs/(\d+)/reactions$#', $uri, $matches)) {
    $identifier = $queryParams['identifier'] ?? null;
    $reactionController->getByBlogId($matches[1], $identifier);
}

if ($method === 'POST' && preg_match('#^/blogs/(\d+)/reactions$#', $uri, $matches)) {
    $reactionController->add($matches[1], $data);
}

if ($method === 'DELETE' && preg_match('#^/blogs/(\d+)/reactions$#', $uri, $matches)) {
    $reactionController->remove($matches[1], $data);
}

if ($method === 'PUT' && preg_match('#^/views/(\d+)$#', $uri, $matches)) {
    $blogController->updateViewDuration($matches[1], $data);
}

// Contact form route (public)
if ($method === 'POST' && $uri === '/contact') {
    $contactController->submit($data);
}

// Authenticated routes
$user = AuthMiddleware::authenticate();

if ($method === 'POST' && $uri === '/auth/register') {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $authController->register($data, $user);
}

if ($method === 'POST' && $uri === '/auth/change-password') {
    $authController->changePassword($data, $user);
}

if ($method === 'GET' && $uri === '/auth/profile') {
    $authController->getProfile($user);
}

if ($method === 'POST' && $uri === '/blogs') {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $blogController->create($data, $user);
}

if ($method === 'PUT' && preg_match('#^/blogs/(\d+)$#', $uri, $matches)) {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $blogController->update($matches[1], $data, $user);
}

if ($method === 'DELETE' && preg_match('#^/blogs/(\d+)$#', $uri, $matches)) {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $blogController->delete($matches[1], $user);
}

if ($method === 'PATCH' && preg_match('#^/blogs/(\d+)/visibility$#', $uri, $matches)) {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $blogController->toggleVisibility($matches[1], $user);
}

if ($method === 'POST' && preg_match('#^/blogs/(\d+)/comments/(\d+)/reply$#', $uri, $matches)) {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $commentController->createAdminReply($matches[1], $matches[2], $data, $user);
}

if ($method === 'DELETE' && preg_match('#^/comments/(\d+)$#', $uri, $matches)) {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $commentController->delete($matches[1], $user);
}

if ($method === 'GET' && $uri === '/users') {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $userController->getAll($user);
}

if ($method === 'DELETE' && preg_match('#^/users/(\d+)$#', $uri, $matches)) {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $userController->delete($matches[1], $user);
}

// Upload routes
if ($method === 'POST' && $uri === '/upload/image') {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $uploadController->uploadImage($data);
}

if ($method === 'POST' && $uri === '/upload/blog-images') {
    RoleMiddleware::checkRole($user, ['super_admin', 'admin']);
    $uploadController->uploadBlogImages($data);
}

if ($method === 'POST' && $uri === '/upload/cleanup') {
    RoleMiddleware::checkRole($user, ['super_admin']);
    $uploadController->cleanupEmptyFolders();
}

Response::notFound('Endpoint not found');