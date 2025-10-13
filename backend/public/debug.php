<?php
header('Content-Type: text/plain');

echo "=== DEBUG INFO ===\n\n";
echo "REQUEST_URI: " . $_SERVER['REQUEST_URI'] . "\n";
echo "SCRIPT_NAME: " . $_SERVER['SCRIPT_NAME'] . "\n";
echo "PHP_SELF: " . $_SERVER['PHP_SELF'] . "\n";
echo "REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD'] . "\n\n";

$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);
echo "Parsed PATH: $path\n\n";

$uriParts = explode('/', trim($path, '/'));
echo "URI Parts:\n";
print_r($uriParts);

echo "\n=== TEST ROUTES ===\n\n";

echo "Test: GET /health\n";
echo "  Match: " . ($path === '/health' || $path === '/api/health' ? 'YES' : 'NO') . "\n\n";

echo "Test: GET /blogs\n";
echo "  Match: " . ($path === '/blogs' || $path === '/api/blogs' ? 'YES' : 'NO') . "\n\n";

echo "Test: POST /auth/login\n";
echo "  Match: " . ($path === '/auth/login' || $path === '/api/auth/login' ? 'YES' : 'NO') . "\n\n";

echo "=== HEADERS ===\n";
foreach (getallheaders() as $key => $value) {
    echo "$key: $value\n";
}