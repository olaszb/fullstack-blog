<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostCreateRequest;
use App\Http\Requests\PostUpdateRequest;
use App\Models\Post;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(){
        $posts = Post::orderBy("created_at", "DESC")->paginate(10);

        return response()->json($posts);
    }

    public function store(PostCreateRequest $request) {
        $data = $request->validated();

        
        $imagePath = $data['thumbnail']->store('posts', 'public');
        $data['thumbnail'] = $imagePath;
         
        // $pattern = '/\!\[.*?\]\((.*?)\)/';
        // if (preg_match($pattern, $data['content'], $matches)) {
        //     $data['featured_image_url'] = $matches[1];
        // } else {
        //     $data['featured_image_url'] = null;
        // }
        
        $data['user_id'] = $request->user()->id;
        $data['slug'] = Str::slug($data['title']);

        $post = $request->user()->posts()->create($data);

        return response()->json(['message' => 'Post created successfully', 'post' => $post]);
    }
    public function show($slug) {
    // Find post or return 404
        $post = Post::where('slug', $slug)->firstOrFail();
        return response()->json($post);
    }
    
    public function uploadImage(Request $request)
    {
    $request->validate([
        'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('content-images', 'public');
        
        return response()->json([
            'url' => asset('storage/' . $path)
        ]);
    }

    return response()->json(['error' => 'No image uploaded'], 400);
    }

    public function update(PostUpdateRequest $request, Post $post){
        Gate::authorize('update', Post::class);
        $data = $request->validated();

        if($request->hasFile('thumbnail')){
            if($post->thumbnail){
                Storage::disk('public')->delete($post->thumbnail);
            }

            $data['thumbnail'] = $request->file('thumbnail')->store('posts', 'public');
        }

        if ($post->title !== $data['title']) {
        $data['slug'] = Str::slug($data['title']);
        }

        $post->update($data);

        return response()->json([
            'message' => 'Post updated successfully!',
            'post' => $post,
        ]);
    }

    public function userPosts(Request $request){
        $posts = $request->user()->posts()->latest()->get();

        return response()->json([
            'status' => 'success',
            'posts' => $posts,
        ]);
    }
}
