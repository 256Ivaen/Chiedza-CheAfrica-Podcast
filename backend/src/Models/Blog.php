<?php

namespace App\Models;

use PDO;

class Blog {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function create($data) {
        $stmt = $this->db->prepare(
            "INSERT INTO blogs (title, category, author, image, hero_image, excerpt, content, 
             featured, tags, hero_data, read_time, visible, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())"
        );
        
        $tags = is_array($data['tags']) ? json_encode($data['tags']) : $data['tags'];
        $heroData = is_array($data['hero_data']) ? json_encode($data['hero_data']) : $data['hero_data'];
        
        $stmt->execute([
            $data['title'],
            $data['category'],
            $data['author'],
            $data['image'],
            $data['hero_image'],
            $data['excerpt'],
            $data['content'],
            $data['featured'] ?? false,
            $tags,
            $heroData,
            $data['read_time'] ?? '5 min read',
            $data['visible'] ?? true
        ]);
        
        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        $fields = [];
        $values = [];
        
        $allowedFields = ['title', 'category', 'author', 'image', 'hero_image', 'excerpt', 
                          'content', 'featured', 'tags', 'hero_data', 'read_time', 'visible'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                
                if ($field === 'tags' || $field === 'hero_data') {
                    $values[] = is_array($data[$field]) ? json_encode($data[$field]) : $data[$field];
                } else {
                    $values[] = $data[$field];
                }
            }
        }
        
        if (empty($fields)) {
            return false;
        }
        
        $fields[] = "updated_at = NOW()";
        $values[] = $id;
        
        $sql = "UPDATE blogs SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute($values);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM blogs WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function findById($id) {
        $stmt = $this->db->prepare(
            "SELECT b.*, 
             (SELECT COUNT(*) FROM reactions WHERE blog_id = b.id) as reaction_count,
             (SELECT COUNT(*) FROM comments WHERE blog_id = b.id) as comment_count,
             (SELECT COUNT(*) FROM blog_views WHERE blog_id = b.id) as view_count
             FROM blogs b 
             WHERE b.id = ? LIMIT 1"
        );
        $stmt->execute([$id]);
        $blog = $stmt->fetch();
        
        if ($blog) {
            $blog['tags'] = json_decode($blog['tags'], true);
            $blog['hero_data'] = json_decode($blog['hero_data'], true);
        }
        
        return $blog;
    }

    public function getAll($visibleOnly = true, $limit = null, $offset = 0) {
        $sql = "SELECT b.*, 
                (SELECT COUNT(*) FROM reactions WHERE blog_id = b.id) as reaction_count,
                (SELECT COUNT(*) FROM comments WHERE blog_id = b.id) as comment_count,
                (SELECT COUNT(*) FROM blog_views WHERE blog_id = b.id) as view_count
                FROM blogs b";
        
        if ($visibleOnly) {
            $sql .= " WHERE b.visible = 1";
        }
        
        $sql .= " ORDER BY b.created_at DESC";
        
        if ($limit) {
            $sql .= " LIMIT ? OFFSET ?";
        }
        
        $stmt = $this->db->prepare($sql);
        
        if ($limit) {
            $stmt->execute([$limit, $offset]);
        } else {
            $stmt->execute();
        }
        
        $blogs = $stmt->fetchAll();
        
        foreach ($blogs as &$blog) {
            $blog['tags'] = json_decode($blog['tags'], true);
            $blog['hero_data'] = json_decode($blog['hero_data'], true);
        }
        
        return $blogs;
    }

    public function toggleVisibility($id) {
        $stmt = $this->db->prepare("UPDATE blogs SET visible = NOT visible, updated_at = NOW() WHERE id = ?");
        return $stmt->execute([$id]);
    }
}