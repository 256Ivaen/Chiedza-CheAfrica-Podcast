<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== ROUTE DEBUG TOOL ===\n\n";

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$originalUri = $uri;
$uri = str_replace('/backend/public', '', $uri);
$uri = rtrim($uri, '/');

echo "Original URI: $originalUri\n";
echo "Cleaned URI: $uri\n";
echo "Method: $method\n\n";

$uriParts = explode('/', trim($uri, '/'));
$resource = $uriParts[0] ?? '';

echo "URI Parts:\n";
print_r($uriParts);
echo "\n";
echo "Resource: '$resource'\n";
echo "Count: " . count($uriParts) . "\n\n";

echo "=== CONDITION CHECKS ===\n\n";

echo "Health check: ";
if ($method === 'GET' && $resource === 'health') {
    echo "✓ MATCH\n";
} else {
    echo "✗ NO MATCH\n";
    echo "  - Method match: " . ($method === 'GET' ? '✓' : '✗') . "\n";
    echo "  - Resource match: " . ($resource === 'health' ? '✓' : '✗') . "\n";
}
echo "\n";

echo "Login: ";
if ($method === 'POST' && $resource === 'auth' && isset($uriParts[1]) && $uriParts[1] === 'login') {
    echo "✓ MATCH\n";
} else {
    echo "✗ NO MATCH\n";
    echo "  - Method match: " . ($method === 'POST' ? '✓' : '✗') . "\n";
    echo "  - Resource match: " . ($resource === 'auth' ? '✓' : '✗') . "\n";
    echo "  - uriParts[1] isset: " . (isset($uriParts[1]) ? '✓' : '✗') . "\n";
    echo "  - uriParts[1] value: '" . ($uriParts[1] ?? 'NOT SET') . "'\n";
    echo "  - uriParts[1] === 'login': " . ((isset($uriParts[1]) && $uriParts[1] === 'login') ? '✓' : '✗') . "\n";
}
echo "\n";

echo "Get all blogs: ";
if ($method === 'GET' && $resource === 'blogs' && count($uriParts) === 1) {
    echo "✓ MATCH\n";
} else {
    echo "✗ NO MATCH\n";
    echo "  - Method match: " . ($method === 'GET' ? '✓' : '✗') . "\n";
    echo "  - Resource match: " . ($resource === 'blogs' ? '✓' : '✗') . "\n";
    echo "  - Count match: " . (count($uriParts) === 1 ? '✓' : '✗') . " (count=" . count($uriParts) . ")\n";
}
echo "\n";

echo "Get single blog (id=1): ";
if ($method === 'GET' && $resource === 'blogs' && isset($uriParts[1]) && is_numeric($uriParts[1]) && count($uriParts) === 2) {
    echo "✓ MATCH\n";
} else {
    echo "✗ NO MATCH\n";
    echo "  - Method match: " . ($method === 'GET' ? '✓' : '✗') . "\n";
    echo "  - Resource match: " . ($resource === 'blogs' ? '✓' : '✗') . "\n";
    echo "  - uriParts[1] isset: " . (isset($uriParts[1]) ? '✓' : '✗') . "\n";
    echo "  - uriParts[1] is_numeric: " . (isset($uriParts[1]) && is_numeric($uriParts[1]) ? '✓' : '✗') . "\n";
    echo "  - Count match: " . (count($uriParts) === 2 ? '✓' : '✗') . " (count=" . count($uriParts) . ")\n";
}
echo "\n";

echo "=== AUTHENTICATION CHECK ===\n";
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
echo "Authorization header: " . ($authHeader ?? 'NOT SET') . "\n";

echo "\n=== END DEBUG ===\n";