<?php

namespace App\Controllers;

use App\Models\Comment;
use App\Utils\Response;

class CommentController {
    private $commentModel;

    public function __construct($db) {
        $this->commentModel = new Comment($db);
    }

    public function create($blogId, $data) {
        if (!isset($data['name']) || !isset($data['email']) || !isset($data['content'])) {
            Response::error('Name, email, and content are required', 400);
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email address', 400);
        }

        $parentId = $data['parent_id'] ?? null;

        $commentId = $this->commentModel->create(
            $blogId,
            $data['name'],
            $data['email'],
            $data['content'],
            $parentId
        );

        Response::created(['id' => $commentId], 'Comment added successfully');
    }

    public function createAdminReply($blogId, $commentId, $data, $currentUser) {
        if (!isset($data['content'])) {
            Response::error('Content is required', 400);
        }

        $replyId = $this->commentModel->createAdminReply(
            $blogId,
            $commentId,
            $currentUser['user_id'],
            $data['content']
        );

        Response::created(['id' => $replyId], 'Reply added successfully');
    }

    public function getByBlogId($blogId) {
        $comments = $this->commentModel->getByBlogId($blogId);

        Response::success($comments);
    }

    public function delete($id, $currentUser) {
        $this->commentModel->delete($id);

        Response::success(null, 'Comment deleted successfully');
    }
}