<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\CategoryController;
use App\Http\Controllers\api\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/posts', [PostController::class, 'index'])->name('post.index');
Route::get('/categories', [CategoryController::class, 'index'])->name('category.index');
Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
Route::post('/register', [AuthController::class, 'register'])->name('auth.register');

//post details
Route::get('/posts/{slug}', [PostController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {
    //create post
    Route::post('/post/create', [PostController::class,'store'])->name('post.store');
    
    Route::post('/post/upload-image', [App\Http\Controllers\api\PostController::class, 'uploadImage']);
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    
    //update post
    Route::put('/posts/{post}', [PostController::class, 'update'])->name('post.update');
    
    //user posts
    Route::get('/user/posts', [PostController::class, 'userPosts'])->name('user.posts'); 
    
    //archived posts
    Route::get('user/archived-posts', [PostController::class, 'archived'])->name('user.archived');

    //soft delete
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('post.destroy');

    //restore
    Route::post('/posts/{id}/restore', [PostController::class, 'restore'])->name('post.restore');

    //force delete
    Route::delete('/posts/{id}/force', [PostController::class, 'forceDelete'])->name('post.forceDelete');

    Route::get('/admin/posts-by-user', [PostController::class, 'adminUserPosts']);

    Route::get('/posts/archived/{slug}', [PostController::class, 'showArchived']);
});
