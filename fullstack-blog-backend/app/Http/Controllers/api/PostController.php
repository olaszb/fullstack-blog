<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostCreateRequest;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(){
        $posts = Post::orderBy("created_at", "DESC")->paginate(10);

        return response()->json($posts);
    }

    public function store(PostCreateRequest $request) {
        $data = $request->validated();

        if($data['image']){
            $imagePath = $data['image']->store('posts', 'public');
            $data['image'] = $imagePath;
        }
        
        $data['user_id'] = $request->user()->id;
        $data['slug'] = Str::slug($data['title']);

        $post = $request->user()->posts()->create($data);

        return response()->json(['message' => 'Post created successfully', 'post' => $post]);
    }

    
}
