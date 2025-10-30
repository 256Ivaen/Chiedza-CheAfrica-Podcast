<?php

namespace App\Models;

use PDO;

class Reaction {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function add($blogId, $type, $identifier) {
        // Check if already reacted
        $stmt = $this->db->prepare(
            "SELECT id FROM reactions WHERE blog_id = ? AND identifier = ?"
        );
        $stmt->execute([$blogId, $identifier]);
        
        if ($stmt->fetch()) {
            // Update existing reaction
            $stmt = $this->db->prepare(
                "UPDATE reactions SET type = ?, created_at = NOW() WHERE blog_id = ? AND identifier = ?"
            );
            return $stmt->execute([$type, $blogId, $identifier]);
        } else {
            // Create new reaction
            $stmt = $this->db->prepare(
                "INSERT INTO reactions (blog_id, type, identifier, created_at) VALUES (?, ?, ?, NOW())"
            );
            $stmt->execute([$blogId, $type, $identifier]);
            return $this->db->lastInsertId();
        }
    }

    public function remove($blogId, $identifier) {
        $stmt = $this->db->prepare("DELETE FROM reactions WHERE blog_id = ? AND identifier = ?");
        return $stmt->execute([$blogId, $identifier]);
    }

    public function getByBlogId($blogId) {
        $stmt = $this->db->prepare(
            "SELECT type, COUNT(*) as count 
             FROM reactions 
             WHERE blog_id = ? 
             GROUP BY type"
        );
        
        $stmt->execute([$blogId]);
        return $stmt->fetchAll();
    }

    public function getUserReaction($blogId, $identifier) {
        $stmt = $this->db->prepare(
            "SELECT type FROM reactions WHERE blog_id = ? AND identifier = ? LIMIT 1"
        );
        $stmt->execute([$blogId, $identifier]);
        $result = $stmt->fetch();
        
        return $result ? $result['type'] : null;
    }
}