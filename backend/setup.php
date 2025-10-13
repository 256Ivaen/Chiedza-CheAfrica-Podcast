<?php
/**
 * Environment Setup Verification Script
 * 
 * This script verifies that the backend is properly configured.
 * Database tables should be created manually via Hostinger control panel.
 * 
 * Usage: php setup.php
 * 
 * @version 1.0.0
 */

// Disable output buffering for real-time feedback
if (ob_get_level()) {
    ob_end_flush();
}

echo "\n";
echo "================================================================================\n";
echo "                    BLOG SYSTEM SETUP VERIFICATION                              \n";
echo "================================================================================\n";
echo "\n";

// Check if .env file exists
$envFile = __DIR__ . '/.env';

if (!file_exists($envFile)) {
    echo "ERROR: .env file not found.\n";
    echo "Please ensure the .env file exists in the backend root directory.\n";
    echo "\n";
    exit(1);
}

echo "[1/5] Checking environment file...\n";
echo "      .env file found.\n\n";

// Load environment variables
echo "[2/5] Loading environment variables...\n";
$lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$envVars = [];

foreach ($lines as $line) {
    $line = trim($line);
    
    // Skip comments and empty lines
    if (empty($line) || strpos($line, '#') === 0) {
        continue;
    }
    
    // Parse environment variable
    if (strpos($line, '=') !== false) {
        list($name, $value) = explode('=', $line, 2);
        $envVars[trim($name)] = trim($value);
        $_ENV[trim($name)] = trim($value);
    }
}

echo "      Loaded " . count($envVars) . " environment variables.\n\n";

// Validate required environment variables
echo "[3/5] Validating configuration...\n";

$required = [
    'DB_HOST' => 'Database host',
    'DB_NAME' => 'Database name',
    'DB_USER' => 'Database user',
    'DB_PASS' => 'Database password',
    'JWT_SECRET' => 'JWT secret key',
    'JWT_EXPIRY' => 'JWT expiry time',
    'SMTP_HOST' => 'SMTP host',
    'SMTP_PORT' => 'SMTP port',
    'SMTP_USER' => 'SMTP user',
    'SMTP_PASS' => 'SMTP password',
    'SMTP_FROM' => 'SMTP from address',
    'SMTP_FROM_NAME' => 'SMTP from name',
    'APP_URL' => 'Application URL',
    'APP_ENV' => 'Application environment'
];

$missing = [];
$configured = 0;

foreach ($required as $var => $description) {
    if (!isset($envVars[$var]) || empty($envVars[$var])) {
        $missing[] = "  - $var ($description)";
    } else {
        $configured++;
    }
}

if (!empty($missing)) {
    echo "\n";
    echo "WARNING: Missing or empty environment variables:\n";
    foreach ($missing as $item) {
        echo "$item\n";
    }
    echo "\n";
} else {
    echo "      All required environment variables are configured.\n";
}

echo "      Configured: $configured of " . count($required) . " variables.\n\n";

// Check file permissions
echo "[4/5] Checking file permissions...\n";

$dirsToCheck = ['config', 'src', 'public'];
$permissionsOk = true;

foreach ($dirsToCheck as $dir) {
    $path = __DIR__ . '/' . $dir;
    if (file_exists($path)) {
        if (is_readable($path)) {
            echo "      $dir/ - OK\n";
        } else {
            echo "      $dir/ - WARNING: Not readable\n";
            $permissionsOk = false;
        }
    } else {
        echo "      $dir/ - WARNING: Directory not found\n";
        $permissionsOk = false;
    }
}

if ($permissionsOk) {
    echo "      All directories are accessible.\n";
}
echo "\n";

// Verify critical files
echo "[5/5] Verifying critical files...\n";

$criticalFiles = [
    'public/index.php' => 'Main entry point',
    'config/database.php' => 'Database configuration',
    'config/cors.php' => 'CORS configuration',
    'src/Utils/JWT.php' => 'JWT utility',
    'src/Utils/Response.php' => 'Response utility',
    'src/Utils/Email.php' => 'Email utility'
];

$filesOk = 0;

foreach ($criticalFiles as $file => $description) {
    $path = __DIR__ . '/' . $file;
    if (file_exists($path)) {
        echo "      $file - OK\n";
        $filesOk++;
    } else {
        echo "      $file - MISSING\n";
    }
}

echo "      Found $filesOk of " . count($criticalFiles) . " critical files.\n\n";

// Display summary
echo "================================================================================\n";
echo "                         SETUP VERIFICATION COMPLETE                            \n";
echo "================================================================================\n";
echo "\n";

echo "Configuration Summary:\n";
echo "  Environment:    " . ($envVars['APP_ENV'] ?? 'Not set') . "\n";
echo "  API URL:        " . ($envVars['APP_URL'] ?? 'Not set') . "\n";
echo "  Database:       " . ($envVars['DB_NAME'] ?? 'Not set') . "\n";
echo "  JWT Configured: " . (isset($envVars['JWT_SECRET']) && !empty($envVars['JWT_SECRET']) ? 'Yes' : 'No') . "\n";
echo "  SMTP Configured: " . (isset($envVars['SMTP_HOST']) && !empty($envVars['SMTP_HOST']) ? 'Yes' : 'No') . "\n";
echo "\n";

if (empty($missing) && $permissionsOk && $filesOk === count($criticalFiles)) {
    echo "STATUS: All checks passed. Backend is ready for deployment.\n";
    echo "\n";
    echo "IMPORTANT - Manual Database Setup Required:\n";
    echo "  1. Login to Hostinger control panel\n";
    echo "  2. Go to phpMyAdmin\n";
    echo "  3. Select database: " . ($envVars['DB_NAME'] ?? 'your_database') . "\n";
    echo "  4. Import the SQL schema from: src/Database/schema.sql\n";
    echo "\n";
    echo "After importing the schema, your API will be accessible at:\n";
    echo "  " . ($envVars['APP_URL'] ?? 'Not configured') . "\n";
    echo "\n";
    echo "Default Login Credentials (after schema import):\n";
    echo "  Email:    iodekeivan@gmail.com\n";
    echo "  Password: admin123\n";
    echo "\n";
    echo "SECURITY NOTICE:\n";
    echo "  Change the default admin password immediately after first login.\n";
    echo "\n";
    exit(0);
} else {
    echo "STATUS: Some issues detected. Please review the warnings above.\n";
    echo "\n";
    
    if (!empty($missing)) {
        echo "ACTION REQUIRED:\n";
        echo "  Update .env file with missing configuration values.\n";
        echo "\n";
    }
    
    if (!$permissionsOk) {
        echo "ACTION REQUIRED:\n";
        echo "  Fix directory permissions. Run: chmod -R 755 .\n";
        echo "\n";
    }
    
    if ($filesOk !== count($criticalFiles)) {
        echo "ACTION REQUIRED:\n";
        echo "  Ensure all backend files are properly uploaded.\n";
        echo "\n";
    }
    
    exit(1);
}

echo "================================================================================\n";
echo "\n";