<?php

namespace App\Controllers;

use App\Models\Blog;
use App\Models\BlogView;
use App\Utils\Response;

class BlogController {
    private $blogModel;
    private $blogViewModel;

    public function __construct($db) {
        $this->blogModel = new Blog($db);
        $this->blogViewModel = new BlogView($db);
    }

    public function create($data, $currentUser) {
        $required = ['title', 'category', 'author', 'excerpt', 'content'];
        
        foreach ($required as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                Response::error("Field '$field' is required", 400);
            }
        }

        // Set defaults
        $data['image'] = $data['image'] ?? '';
        $data['hero_image'] = $data['hero_image'] ?? '';
        $data['featured'] = $data['featured'] ?? false;
        $data['visible'] = $data['visible'] ?? true;
        $data['tags'] = $data['tags'] ?? [];
        $data['hero_data'] = $data['hero_data'] ?? [];
        $data['read_time'] = $data['read_time'] ?? '5 min read';

        $blogId = $this->blogModel->create($data);

        $blog = $this->blogModel->findById($blogId);

        Response::created($blog, 'Blog created successfully');
    }

    public function update($id, $data, $currentUser) {
        $blog = $this->blogModel->findById($id);
        
        if (!$blog) {
            Response::notFound('Blog not found');
        }

        $updated = $this->blogModel->update($id, $data);

        if (!$updated) {
            Response::error('No changes made', 400);
        }

        $blog = $this->blogModel->findById($id);

        Response::success($blog, 'Blog updated successfully');
    }

    public function delete($id, $currentUser) {
        $blog = $this->blogModel->findById($id);
        
        if (!$blog) {
            Response::notFound('Blog not found');
        }

        $this->blogModel->delete($id);

        Response::success(null, 'Blog deleted successfully');
    }

    public function getAll($queryParams = []) {
        $page = isset($queryParams['page']) ? (int)$queryParams['page'] : 1;
        $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 10;
        $offset = ($page - 1) * $limit;
        
        $visibleOnly = !isset($queryParams['include_hidden']);

        $blogs = $this->blogModel->getAll($visibleOnly, $limit, $offset);

        Response::success([
            'blogs' => $blogs,
            'page' => $page,
            'limit' => $limit
        ]);
    }

    public function getById($id, $identifier = null) {
        $blog = $this->blogModel->findById($id);
        
        if (!$blog) {
            Response::notFound('Blog not found');
        }

        // Record view if identifier provided
        if ($identifier) {
            $viewId = $this->blogViewModel->recordView($id, $identifier);
            $blog['view_id'] = $viewId;
        }

        // Get view stats
        $blog['view_stats'] = $this->blogViewModel->getStats($id);

        Response::success($blog);
    }

    public function toggleVisibility($id, $currentUser) {
        $blog = $this->blogModel->findById($id);
        
        if (!$blog) {
            Response::notFound('Blog not found');
        }
    
        $success = $this->blogModel->toggleVisibility($id);
        
        if (!$success) {
            Response::error('Failed to update visibility', 500);
        }
    
        $blog = $this->blogModel->findById($id);
    
        Response::success($blog, 'Blog visibility updated');
    }

    public function updateViewDuration($viewId, $data) {
        if (!isset($data['duration'])) {
            Response::error('Duration is required', 400);
        }

        $this->blogViewModel->updateDuration($viewId, $data['duration']);

        Response::success(null, 'View duration updated');
    }
}