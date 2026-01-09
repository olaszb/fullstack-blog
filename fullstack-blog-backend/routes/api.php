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

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/post/create', [PostController::class,'store'])->name('post.store');
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');    
});
