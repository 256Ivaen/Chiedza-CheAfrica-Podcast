<?php

namespace App\Controllers;

use App\Models\Reaction;
use App\Utils\Response;

class ReactionController {
    private $reactionModel;

    public function __construct($db) {
        $this->reactionModel = new Reaction($db);
    }

    public function add($blogId, $data) {
        if (!isset($data['type']) || !isset($data['identifier'])) {
            Response::error('Type and identifier are required', 400);
        }

        $allowedTypes = ['like', 'love', 'insightful', 'celebrate'];
        if (!in_array($data['type'], $allowedTypes)) {
            Response::error('Invalid reaction type', 400);
        }

        $this->reactionModel->add($blogId, $data['type'], $data['identifier']);

        $reactions = $this->reactionModel->getByBlogId($blogId);

        Response::success($reactions, 'Reaction added successfully');
    }

    public function remove($blogId, $data) {
        if (!isset($data['identifier'])) {
            Response::error('Identifier is required', 400);
        }

        $this->reactionModel->remove($blogId, $data['identifier']);

        Response::success(null, 'Reaction removed successfully');
    }

    public function getByBlogId($blogId, $identifier = null) {
        $reactions = $this->reactionModel->getByBlogId($blogId);
        
        $response = ['reactions' => $reactions];
        
        if ($identifier) {
            $response['user_reaction'] = $this->reactionModel->getUserReaction($blogId, $identifier);
        }

        Response::success($response);
    }
}