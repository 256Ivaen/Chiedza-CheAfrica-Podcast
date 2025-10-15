<?php

namespace App\Models;

use PDO;

class Comment {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function create($blogId, $name, $email, $content, $parentId = null) {
        $stmt = $this->db->prepare(
            "INSERT INTO comments (blog_id, name, email, content, parent_id, created_at) 
             VALUES (?, ?, ?, ?, ?, NOW())"
        );
        
        $stmt->execute([$blogId, $name, $email, $content, $parentId]);
        return $this->db->lastInsertId();
    }

    public function createAdminReply($blogId, $commentId, $userId, $content) {
        $stmt = $this->db->prepare(
            "INSERT INTO comments (blog_id, user_id, content, parent_id, is_admin_reply, created_at) 
             VALUES (?, ?, ?, ?, 1, NOW())"
        );
        
        $stmt->execute([$blogId, $userId, $content, $commentId]);
        return $this->db->lastInsertId();
    }

    public function getByBlogId($blogId) {
        $stmt = $this->db->prepare(
            "SELECT c.*, u.email as admin_email 
             FROM comments c 
             LEFT JOIN users u ON c.user_id = u.id 
             WHERE c.blog_id = ? 
             ORDER BY c.created_at DESC"
        );
        
        $stmt->execute([$blogId]);
        $comments = $stmt->fetchAll();
        
        // Organize comments with replies
        $organized = [];
        $commentMap = [];
        
        foreach ($comments as $comment) {
            $comment['replies'] = [];
            $commentMap[$comment['id']] = $comment;
        }
        
        foreach ($commentMap as $id => $comment) {
            if ($comment['parent_id']) {
                $commentMap[$comment['parent_id']]['replies'][] = &$commentMap[$id];
            } else {
                $organized[] = &$commentMap[$id];
            }
        }
        
        return $organized;
    }

    public function delete($id) {
        // Delete replies first
        $stmt = $this->db->prepare("DELETE FROM comments WHERE parent_id = ?");
        $stmt->execute([$id]);
        
        // Delete the comment
        $stmt = $this->db->prepare("DELETE FROM comments WHERE id = ?");
        return $stmt->execute([$id]);
    }
}