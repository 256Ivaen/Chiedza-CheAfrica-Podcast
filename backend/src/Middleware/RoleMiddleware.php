<?php

namespace App\Middleware;

use App\Utils\Response;

class RoleMiddleware {
    public static function checkRole($user, $allowedRoles) {
        if (!in_array($user['role'], $allowedRoles)) {
            Response::forbidden('You do not have permission to access this resource');
        }
    }
}