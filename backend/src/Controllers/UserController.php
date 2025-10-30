<?php

namespace App\Controllers;

use App\Models\User;
use App\Utils\Response;

class UserController {
    private $userModel;

    public function __construct($db) {
        $this->userModel = new User($db);
    }

    public function getAll($currentUser) {
        $users = $this->userModel->getAll();

        Response::success($users);
    }

    public function delete($id, $currentUser) {
        // Prevent self-deletion
        if ($id == $currentUser['user_id']) {
            Response::error('You cannot delete your own account', 400);
        }

        $user = $this->userModel->findById($id);
        
        if (!$user) {
            Response::notFound('User not found');
        }

        // Only super_admin can delete super_admin
        if ($user['role'] === 'super_admin' && $currentUser['role'] !== 'super_admin') {
            Response::forbidden('Only super_admin can delete super_admin users');
        }

        $this->userModel->delete($id);

        Response::success(null, 'User deleted successfully');
    }
}