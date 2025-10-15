<?php

namespace App\Models;

use PDO;

class User {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function findByEmail($email) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT id, email, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($email, $password, $role) {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
        
        $stmt = $this->db->prepare(
            "INSERT INTO users (email, password, role, created_at, updated_at) 
             VALUES (?, ?, ?, NOW(), NOW())"
        );
        
        $stmt->execute([$email, $hashedPassword, $role]);
        return $this->db->lastInsertId();
    }

    public function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    public function updatePassword($userId, $newPassword) {
        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        
        $stmt = $this->db->prepare("UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?");
        return $stmt->execute([$hashedPassword, $userId]);
    }

    public function getAll() {
        $stmt = $this->db->query("SELECT id, email, role, created_at FROM users ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = ?");
        return $stmt->execute([$id]);
    }
}