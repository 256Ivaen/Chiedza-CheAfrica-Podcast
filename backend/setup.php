<?php
/**
 * Database Setup Script for Blog System
 * 
 * This script creates all necessary database tables for the blog system.
 * The database must already exist before running this script.
 * 
 * Usage: php setup.php
 * 
 * @author Blog System
 * @version 1.0.0
 */

// Disable output buffering for real-time feedback
if (ob_get_level()) {
    ob_end_flush();
}

echo "\n";
echo "================================================================================\n";
echo "                    BLOG SYSTEM DATABASE SETUP                                  \n";
echo "================================================================================\n";
echo "\n";

// Load environment variables
$envFile = __DIR__ . '/.env';

if (!file_exists($envFile)) {
    echo "ERROR: .env file not found.\n";
    echo "Please ensure the .env file exists in the backend root directory.\n";
    echo "\n";
    exit(1);
}

echo "[1/6] Loading environment variables...\n";
$lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

foreach ($lines as $line) {
    $line = trim($line);
    
    // Skip comments and empty lines
    if (empty($line) || strpos($line, '#') === 0) {
        continue;
    }
    
    // Parse environment variable
    if (strpos($line, '=') !== false) {
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

echo "      Environment variables loaded successfully.\n\n";

// Validate required environment variables
$required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS'];
$missing = [];

foreach ($required as $var) {
    if (!isset($_ENV[$var]) || empty($_ENV[$var])) {
        $missing[] = $var;
    }
}

if (!empty($missing)) {
    echo "ERROR: Missing required environment variables:\n";
    foreach ($missing as $var) {
        echo "  - $var\n";
    }
    echo "\n";
    exit(1);
}

// Database connection
try {
    $host = $_ENV['DB_HOST'];
    $dbname = $_ENV['DB_NAME'];
    $username = $_ENV['DB_USER'];
    $password = $_ENV['DB_PASS'];

    echo "[2/6] Connecting to database server...\n";
    
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $pdo = new PDO($dsn, $username, $password, $options);
    
    echo "      Connected to database: $dbname\n\n";

    // Create tables
    echo "[3/6] Creating database tables...\n";
    echo "--------------------------------------------------------------------------------\n";

    // Users table
    echo "      Creating 'users' table... ";
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('super_admin', 'admin') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_email (email),
            INDEX idx_role (role)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "DONE\n";

    // Blogs table
    echo "      Creating 'blogs' table... ";
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS blogs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(500) NOT NULL,
            category VARCHAR(100) NOT NULL,
            author VARCHAR(255) NOT NULL,
            image TEXT,
            hero_image TEXT,
            excerpt TEXT NOT NULL,
            content LONGTEXT NOT NULL,
            featured BOOLEAN DEFAULT FALSE,
            visible BOOLEAN DEFAULT TRUE,
            tags JSON,
            hero_data JSON,
            read_time VARCHAR(50) DEFAULT '5 min read',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_category (category),
            INDEX idx_featured (featured),
            INDEX idx_visible (visible),
            INDEX idx_created_at (created_at),
            FULLTEXT idx_search (title, excerpt, content)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "DONE\n";

    // Comments table
    echo "      Creating 'comments' table... ";
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS comments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            blog_id INT NOT NULL,
            user_id INT NULL,
            name VARCHAR(255) NULL,
            email VARCHAR(255) NULL,
            content TEXT NOT NULL,
            parent_id INT NULL,
            is_admin_reply BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
            FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
            INDEX idx_blog_id (blog_id),
            INDEX idx_parent_id (parent_id),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "DONE\n";

    // Reactions table
    echo "      Creating 'reactions' table... ";
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS reactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            blog_id INT NOT NULL,
            type ENUM('like', 'love', 'insightful', 'celebrate') NOT NULL,
            identifier VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
            UNIQUE KEY unique_reaction (blog_id, identifier),
            INDEX idx_blog_id (blog_id),
            INDEX idx_type (type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "DONE\n";

    // Blog views table
    echo "      Creating 'blog_views' table... ";
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS blog_views (
            id INT AUTO_INCREMENT PRIMARY KEY,
            blog_id INT NOT NULL,
            identifier VARCHAR(255) NOT NULL,
            duration INT DEFAULT 0,
            viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
            INDEX idx_blog_id (blog_id),
            INDEX idx_viewed_at (viewed_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "DONE\n";

    echo "--------------------------------------------------------------------------------\n";
    echo "      All tables created successfully.\n\n";

    // Check and create default admin user
    echo "[4/6] Checking for default admin user...\n";
    
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users WHERE email = 'admin@example.com'");
    $result = $stmt->fetch();

    if ($result['count'] > 0) {
        echo "      Default admin user already exists.\n\n";
    } else {
        echo "      Creating default admin user...\n";
        
        // Password: admin123 (hashed with bcrypt cost 12)
        $defaultPassword = '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lH4M3fHK7YqW';
        
        $stmt = $pdo->prepare(
            "INSERT INTO users (email, password, role, created_at, updated_at) 
             VALUES (?, ?, 'super_admin', NOW(), NOW())"
        );
        $stmt->execute(['admin@example.com', $defaultPassword]);
        
        echo "      Default admin user created successfully.\n\n";
    }

    // Verify tables
    echo "[5/6] Verifying database structure...\n";
    
    $tables = ['users', 'blogs', 'comments', 'reactions', 'blog_views'];
    $verified = 0;
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            $verified++;
        }
    }
    
    echo "      Verified $verified of " . count($tables) . " tables.\n\n";

    // Display summary
    echo "[6/6] Setup complete.\n\n";
    
    echo "================================================================================\n";
    echo "                         SETUP COMPLETED SUCCESSFULLY                           \n";
    echo "================================================================================\n";
    echo "\n";
    echo "Database Configuration:\n";
    echo "  Host:     $host\n";
    echo "  Database: $dbname\n";
    echo "  Tables:   $verified tables created\n";
    echo "\n";
    echo "Tables Created:\n";
    echo "  1. users         - User authentication and authorization\n";
    echo "  2. blogs         - Blog posts and content\n";
    echo "  3. comments      - Blog comments and admin replies\n";
    echo "  4. reactions     - User reactions (like, love, etc.)\n";
    echo "  5. blog_views    - View tracking and analytics\n";
    echo "\n";
    echo "Default Admin Credentials:\n";
    echo "  Email:    admin@example.com\n";
    echo "  Password: admin123\n";
    echo "\n";
    echo "SECURITY NOTICE:\n";
    echo "  Please change the default admin password immediately after first login.\n";
    echo "\n";
    
    $appUrl = $_ENV['APP_URL'] ?? 'Not configured';
    echo "API Endpoint:\n";
    echo "  URL: $appUrl\n";
    echo "\n";
    echo "Next Steps:\n";
    echo "  1. Test the API health endpoint: $appUrl/health\n";
    echo "  2. Login with default credentials\n";
    echo "  3. Change the default password\n";
    echo "  4. Create additional admin users as needed\n";
    echo "\n";
    echo "================================================================================\n";
    echo "\n";

} catch (PDOException $e) {
    echo "\n";
    echo "================================================================================\n";
    echo "                            DATABASE ERROR                                      \n";
    echo "================================================================================\n";
    echo "\n";
    echo "Error Message:\n";
    echo "  " . $e->getMessage() . "\n";
    echo "\n";
    echo "Troubleshooting:\n";
    echo "  1. Verify database exists and is accessible\n";
    echo "  2. Check database credentials in .env file\n";
    echo "  3. Ensure MySQL/MariaDB service is running\n";
    echo "  4. Verify database user has appropriate privileges:\n";
    echo "     - SELECT, INSERT, UPDATE, DELETE\n";
    echo "     - CREATE, ALTER, INDEX\n";
    echo "     - REFERENCES (for foreign keys)\n";
    echo "\n";
    echo "Database Connection Details:\n";
    echo "  Host:     " . ($host ?? 'Not set') . "\n";
    echo "  Database: " . ($dbname ?? 'Not set') . "\n";
    echo "  User:     " . ($username ?? 'Not set') . "\n";
    echo "\n";
    echo "================================================================================\n";
    echo "\n";
    exit(1);
    
} catch (Exception $e) {
    echo "\n";
    echo "================================================================================\n";
    echo "                              GENERAL ERROR                                     \n";
    echo "================================================================================\n";
    echo "\n";
    echo "Error Message:\n";
    echo "  " . $e->getMessage() . "\n";
    echo "\n";
    echo "Please check the error message above and try again.\n";
    echo "\n";
    echo "================================================================================\n";
    echo "\n";
    exit(1);
}

exit(0);