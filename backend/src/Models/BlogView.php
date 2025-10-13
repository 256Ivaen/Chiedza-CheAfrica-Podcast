<?php

namespace App\Models;

use PDO;

class BlogView {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function recordView($blogId, $identifier, $duration = 0) {
        $stmt = $this->db->prepare(
            "INSERT INTO blog_views (blog_id, identifier, duration, viewed_at) 
             VALUES (?, ?, ?, NOW())"
        );
        
        $stmt->execute([$blogId, $identifier, $duration]);
        return $this->db->lastInsertId();
    }

    public function updateDuration($viewId, $duration) {
        $stmt = $this->db->prepare("UPDATE blog_views SET duration = ? WHERE id = ?");
        return $stmt->execute([$duration, $viewId]);
    }

    public function getStats($blogId) {
        $stmt = $this->db->prepare(
            "SELECT 
                COUNT(*) as total_views,
                COUNT(DISTINCT identifier) as unique_views,
                AVG(duration) as avg_duration,
                MAX(duration) as max_duration
             FROM blog_views 
             WHERE blog_id = ?"
        );
        
        $stmt->execute([$blogId]);
        return $stmt->fetch();
    }
}