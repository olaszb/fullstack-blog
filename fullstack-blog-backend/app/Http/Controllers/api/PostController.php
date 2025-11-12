<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostCreateRequest;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(){
        $posts = Post::orderBy("created_at", "DESC")->paginate(10);

        return $posts;
    }

    public function store(PostCreateRequest $request) {
        

    }
}
