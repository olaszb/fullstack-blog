<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostCreateRequest;
use App\Http\Requests\PostUpdateRequest;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{
    protected $pagination_limit = 9;

    public function index(){
        $posts = Post::orderBy("created_at", "DESC")->paginate($this->pagination_limit);
        return response()->json($posts);
    }

    public function store(PostCreateRequest $request) {
        $data = $request->validated();

        if ($request->hasFile('thumbnail')) {
             $data['thumbnail'] = $request->file('thumbnail')->store('posts', 'public');
        }
        
        $data['user_id'] = $request->user()->id;
        $data['slug'] = Str::slug($data['title']);

        $post = $request->user()->posts()->create($data);

        return response()->json(['message' => 'Post created successfully', 'post' => $post], 201);
    }

    public function show($slug) {
        $post = Post::where('slug', $slug)->firstOrFail();
        
        if ($post->thumbnail && !filter_var($post->thumbnail, FILTER_VALIDATE_URL)) {
            $post->thumbnail_url = asset('storage/' . $post->thumbnail);
        }
        
        return response()->json($post);
    }

    public function showArchived($slug, Request $request) {
        $post = Post::onlyTrashed()->where('slug', $slug)->firstOrFail();

        if ($request->user()->id !== $post->user_id && $request->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($post->thumbnail && !filter_var($post->thumbnail, FILTER_VALIDATE_URL)) {
            $post->thumbnail_url = asset('storage/' . $post->thumbnail);
        }

        return response()->json($post);
    }

    public function update(PostUpdateRequest $request, Post $post){
        Gate::authorize('update', $post);

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
        ], 200);
    }

    public function destroy(Post $post){
        Gate::authorize('delete', $post);
        $post->delete();
        return response()->json(['message' => 'Post archived successfully']);
    }
    
    public function userPosts(Request $request){
        $posts = $request->user()->posts()
                        ->withTrashed() 
                        ->latest()
                        ->paginate($this->pagination_limit);

        $posts->getCollection()->transform(function ($post) {
            if ($post->thumbnail && !filter_var($post->thumbnail, FILTER_VALIDATE_URL)) {
                $post->thumbnail_url = asset('storage/' . $post->thumbnail);
            }
            return $post;
        });

        return response()->json([
            'status' => 'success',
            'posts' => $posts,
        ]);
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

    public function archived(Request $request){
        $posts = $request->user()->posts()->onlyTrashed()->latest()->get()->paginate($this->pagination_limit);

        return response()->json([
            'status' => 'success',
            'posts' => $posts,
        ]);
    }

    public function forceDelete($id){
        $post = Post::withTrashed()->findOrFail($id);

        if ($post->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if($post->thumbnail){
            Storage::disk('public')->delete($post->thumbnail);
        }

        $post->forceDelete();

        return response()->json(['message' => 'Post permanently deleted']);
    }

    public function restore($id){
        $post = Post::withTrashed()->findOrFail($id);

        if ($post->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $post->restore();

        return response()->json(['message' => 'Post restored successfully!']);
    }

    public function adminUserPosts(Request $request, Post $post)
    {
        if ($post->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $users = User::with(['posts' => function($query) {
            $query->withTrashed()->latest();
        }])
        ->has('posts')
        ->get();

        $users->each(function($user) {
            $user->posts->each(function($post) {
                 if ($post->thumbnail && !filter_var($post->thumbnail, FILTER_VALIDATE_URL)) {
                    $post->thumbnail_url = asset('storage/' . $post->thumbnail);
                }
            });
        });

        return response()->json([
            'status' => 'success',
            'data' => $users
        ]);
    }
}
