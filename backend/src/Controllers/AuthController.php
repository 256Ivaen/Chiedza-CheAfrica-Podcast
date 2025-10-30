<?php

namespace App\Controllers;

use App\Models\User;
use App\Utils\JWT;
use App\Utils\Response;
use App\Utils\Email;

class AuthController {
    private $userModel;

    public function __construct($db) {
        $this->userModel = new User($db);
    }

    public function login($data) {
        if (!isset($data['email']) || !isset($data['password'])) {
            Response::error('Email and password are required', 400);
        }

        $user = $this->userModel->findByEmail($data['email']);

        if (!$user || !$this->userModel->verifyPassword($data['password'], $user['password'])) {
            Response::error('Invalid credentials', 401);
        }

        $token = JWT::encode([
            'user_id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role']
        ]);

        Response::success([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ], 'Login successful');
    }

    public function register($data, $currentUser) {
        // Only super_admin and admin can register new users
        if (!in_array($currentUser['role'], ['super_admin', 'admin'])) {
            Response::forbidden('Only administrators can create new users');
        }

        if (!isset($data['email']) || !isset($data['role'])) {
            Response::error('Email and role are required', 400);
        }

        $allowedRoles = ['super_admin', 'admin'];
        if (!in_array($data['role'], $allowedRoles)) {
            Response::error('Invalid role. Allowed roles: ' . implode(', ', $allowedRoles), 400);
        }

        // Super admin restriction
        if ($data['role'] === 'super_admin' && $currentUser['role'] !== 'super_admin') {
            Response::forbidden('Only super_admin can create other super_admin users');
        }

        // Check if user already exists
        if ($this->userModel->findByEmail($data['email'])) {
            Response::error('User with this email already exists', 409);
        }

        // Generate temporary password
        $tempPassword = bin2hex(random_bytes(8));

        $userId = $this->userModel->create($data['email'], $tempPassword, $data['role']);

        // Send invitation email
        $emailSent = Email::sendInvitation($data['email'], $tempPassword, $data['role']);

        if (!$emailSent) {
            Response::error('User created but failed to send invitation email. Please contact support.', 500);
        }

        Response::created([
            'id' => $userId,
            'email' => $data['email'],
            'role' => $data['role']
        ], 'User created successfully. Invitation email sent.');
    }

    public function changePassword($data, $currentUser) {
        if (!isset($data['current_password']) || !isset($data['new_password'])) {
            Response::error('Current password and new password are required', 400);
        }

        if (strlen($data['new_password']) < 8) {
            Response::error('New password must be at least 8 characters long', 400);
        }

        $user = $this->userModel->findByEmail($currentUser['email']);

        if (!$this->userModel->verifyPassword($data['current_password'], $user['password'])) {
            Response::error('Current password is incorrect', 401);
        }

        $this->userModel->updatePassword($currentUser['user_id'], $data['new_password']);

        Response::success(null, 'Password changed successfully');
    }

    public function getProfile($currentUser) {
        $user = $this->userModel->findById($currentUser['user_id']);
        
        if (!$user) {
            Response::notFound('User not found');
        }

        Response::success($user);
    }
}