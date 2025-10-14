<?php

namespace App\Controllers;

use App\Utils\Response;

class UploadController {
    private $baseUploadPath;
    private $baseUrl;
    private $allowedMimeTypes;
    private $maxFileSize;

    public function __construct() {
        // Set upload directory - use the main domain, not API subdomain
        $this->baseUploadPath = $_SERVER['DOCUMENT_ROOT'] . '/../uploads/blogs/';
        
        // Use main domain instead of API subdomain
        $domain = str_replace('api.', '', $_SERVER['HTTP_HOST']);
        $this->baseUrl = ($_SERVER['REQUEST_SCHEME'] ?? 'https') . '://' . $domain . '/uploads/blogs/';
        
        // Allowed file types
        $this->allowedMimeTypes = [
            'image/jpeg' => 'jpg',
            'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
            'image/svg+xml' => 'svg'
        ];
        
        // Max file size (5MB)
        $this->maxFileSize = 5 * 1024 * 1024;
        
        // Ensure upload directory exists
        $this->ensureUploadDirectory();
    }

    /**
     * Ensure upload directory exists and is writable
     */
    private function ensureUploadDirectory() {
        if (!is_dir($this->baseUploadPath)) {
            if (!mkdir($this->baseUploadPath, 0755, true)) {
                throw new \Exception('Failed to create upload directory: ' . $this->baseUploadPath);
            }
        }
        
        if (!is_writable($this->baseUploadPath)) {
            throw new \Exception('Upload directory is not writable: ' . $this->baseUploadPath);
        }
    }

    /**
     * Sanitize folder name
     */
    private function sanitizeFolderName($name) {
        // Remove special characters and replace spaces with underscores
        $sanitized = preg_replace('/[^a-zA-Z0-9\s_-]/', '', $name);
        $sanitized = preg_replace('/\s+/', '_', $sanitized);
        $sanitized = trim($sanitized, '_-');
        
        // Limit length
        if (strlen($sanitized) > 100) {
            $sanitized = substr($sanitized, 0, 100);
        }
        
        return $sanitized ?: 'untitled';
    }

    /**
     * Generate unique folder name
     */
    private function generateUniqueFolderName($baseName) {
        $sanitized = $this->sanitizeFolderName($baseName);
        $folderPath = $this->baseUploadPath . $sanitized;
        $counter = 1;
        $originalName = $sanitized;

        // If folder exists, append number
        while (is_dir($folderPath)) {
            $sanitized = $originalName . '_' . $counter;
            $folderPath = $this->baseUploadPath . $sanitized;
            $counter++;
            
            // Safety limit
            if ($counter > 100) {
                throw new \Exception('Too many duplicate folder names');
            }
        }

        return $sanitized;
    }

    /**
     * Validate uploaded file
     */
    private function validateFile($file) {
        // Check if file was uploaded
        if (!isset($file['error']) || $file['error'] === UPLOAD_ERR_NO_FILE) {
            throw new \Exception('No file uploaded');
        }

        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errorMessages = [
                UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize directive in php.ini',
                UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE directive in HTML form',
                UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
                UPLOAD_ERR_NO_FILE => 'No file was uploaded',
                UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
                UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
                UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the file upload',
            ];
            throw new \Exception($errorMessages[$file['error']] ?? 'Unknown upload error');
        }

        // Check file size
        if ($file['size'] > $this->maxFileSize) {
            throw new \Exception('File size exceeds maximum limit of 5MB');
        }

        // Check if file is actually an image
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!array_key_exists($mimeType, $this->allowedMimeTypes)) {
            throw new \Exception('Invalid file type. Allowed types: JPG, PNG, GIF, WebP, SVG');
        }

        // Additional security check - verify image dimensions
        $imageInfo = @getimagesize($file['tmp_name']);
        if (!$imageInfo) {
            throw new \Exception('File is not a valid image');
        }

        return [
            'mime_type' => $mimeType,
            'extension' => $this->allowedMimeTypes[$mimeType],
            'width' => $imageInfo[0],
            'height' => $imageInfo[1]
        ];
    }

    /**
     * Generate secure filename
     */
    private function generateFilename($originalName, $extension) {
        $nameWithoutExt = pathinfo($originalName, PATHINFO_FILENAME);
        $sanitized = $this->sanitizeFolderName($nameWithoutExt);
        $timestamp = time();
        $random = bin2hex(random_bytes(4));
        
        return "{$sanitized}_{$timestamp}_{$random}.{$extension}";
    }

    /**
     * Clean and format URL
     */
    private function cleanUrl($url) {
        // Remove any escaped slashes and ensure clean URL
        return str_replace('\\/', '/', $url);
    }

    /**
     * Handle single file upload
     */
    public function uploadImage($data) {
        try {
            // Check if file was provided
            if (!isset($_FILES['image'])) {
                Response::error('No image file provided', 400);
            }

            $file = $_FILES['image'];
            
            // Validate file
            $fileInfo = $this->validateFile($file);
            
            // Get blog title from request data or use default
            $blogTitle = $data['blog_title'] ?? 'blog';
            
            // Generate unique folder name
            $folderName = $this->generateUniqueFolderName($blogTitle);
            $folderPath = $this->baseUploadPath . $folderName;
            
            // Create folder
            if (!mkdir($folderPath, 0755, true)) {
                throw new \Exception('Failed to create blog folder');
            }
            
            // Generate secure filename
            $filename = $this->generateFilename($file['name'], $fileInfo['extension']);
            $filePath = $folderPath . '/' . $filename;
            
            // Move uploaded file
            if (!move_uploaded_file($file['tmp_name'], $filePath)) {
                throw new \Exception('Failed to save uploaded file');
            }
            
            // Set proper permissions
            chmod($filePath, 0644);
            
            // Return success response with cleaned URL
            $publicUrl = $this->cleanUrl($this->baseUrl . $folderName . '/' . $filename);
            
            Response::success([
                'url' => $publicUrl,
                'folder' => $folderName,
                'filename' => $filename,
                'size' => $file['size'],
                'dimensions' => [
                    'width' => $fileInfo['width'],
                    'height' => $fileInfo['height']
                ]
            ], 'Image uploaded successfully');
            
        } catch (\Exception $e) {
            Response::error('Upload failed: ' . $e->getMessage(), 400);
        }
    }

    /**
     * Handle multiple file uploads (cover + hero images)
     */
    public function uploadBlogImages($data) {
        try {
            $uploadedImages = [];
            $blogTitle = $data['blog_title'] ?? 'blog';
            
            // Generate unique folder name once for both images
            $folderName = $this->generateUniqueFolderName($blogTitle);
            $folderPath = $this->baseUploadPath . $folderName;
            
            // Create folder
            if (!mkdir($folderPath, 0755, true)) {
                throw new \Exception('Failed to create blog folder');
            }
            
            // Handle cover image
            if (isset($_FILES['cover_image']) && $_FILES['cover_image']['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES['cover_image'];
                $fileInfo = $this->validateFile($file);
                
                $filename = 'cover_' . $this->generateFilename($file['name'], $fileInfo['extension']);
                $filePath = $folderPath . '/' . $filename;
                
                if (move_uploaded_file($file['tmp_name'], $filePath)) {
                    chmod($filePath, 0644);
                    $cleanUrl = $this->cleanUrl($this->baseUrl . $folderName . '/' . $filename);
                    $uploadedImages['cover_image'] = $cleanUrl;
                }
            }
            
            // Handle hero image
            if (isset($_FILES['hero_image']) && $_FILES['hero_image']['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES['hero_image'];
                $fileInfo = $this->validateFile($file);
                
                $filename = 'hero_' . $this->generateFilename($file['name'], $fileInfo['extension']);
                $filePath = $folderPath . '/' . $filename;
                
                if (move_uploaded_file($file['tmp_name'], $filePath)) {
                    chmod($filePath, 0644);
                    $cleanUrl = $this->cleanUrl($this->baseUrl . $folderName . '/' . $filename);
                    $uploadedImages['hero_image'] = $cleanUrl;
                }
            }
            
            if (empty($uploadedImages)) {
                throw new \Exception('No valid images were uploaded');
            }
            
            Response::success([
                'images' => $uploadedImages,
                'folder' => $folderName
            ], 'Blog images uploaded successfully');
            
        } catch (\Exception $e) {
            // Clean up folder if created but upload failed
            if (isset($folderPath) && is_dir($folderPath)) {
                $this->deleteFolder($folderPath);
            }
            Response::error('Upload failed: ' . $e->getMessage(), 400);
        }
    }

    /**
     * Delete folder recursively
     */
    private function deleteFolder($path) {
        if (!is_dir($path)) return;
        
        $files = array_diff(scandir($path), ['.', '..']);
        foreach ($files as $file) {
            $filePath = $path . '/' . $file;
            is_dir($filePath) ? $this->deleteFolder($filePath) : unlink($filePath);
        }
        rmdir($path);
    }

    /**
     * Clean up empty folders (maintenance)
     */
    public function cleanupEmptyFolders() {
        try {
            $this->cleanupFolder($this->baseUploadPath);
            Response::success(null, 'Cleanup completed successfully');
        } catch (\Exception $e) {
            Response::error('Cleanup failed: ' . $e->getMessage(), 500);
        }
    }

    private function cleanupFolder($path) {
        if (!is_dir($path)) return true;
        
        $files = array_diff(scandir($path), ['.', '..']);
        if (count($files) === 0) {
            return rmdir($path);
        }
        
        $allEmpty = true;
        foreach ($files as $file) {
            $filePath = $path . '/' . $file;
            if (is_dir($filePath)) {
                if (!$this->cleanupFolder($filePath)) {
                    $allEmpty = false;
                }
            } else {
                $allEmpty = false;
            }
        }
        
        return $allEmpty ? rmdir($path) : false;
    }
}