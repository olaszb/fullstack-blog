<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PostTest extends TestCase
{
    use RefreshDatabase;

    
    public function test_guests_cannot_create_posts()
    {
        $response = $this->postJson('/api/post/create', [
            'title' => 'Hacker Post',
            'content' => 'Content',
            'category_id' => 1
        ]);

        $response->assertStatus(401); // Unauthorized
    }

    
    public function test_user_can_create_post_with_thumbnail()
    {
        //Making the user and mocking the public directory
        $user = User::factory()->create();
        $category = Category::factory()->create();
        Storage::fake('public'); 

        // send POST request
        $response = $this->actingAs($user)->postJson('/api/post/create', [
            'title' => 'My First Post',
            'content' => '# Hello World',
            'category_id' => $category->id,
            'thumbnail' => UploadedFile::fake()->image('blog.jpg')
        ]);

        // check success
        $response->assertStatus(201);
        
        // check db
        $this->assertDatabaseHas('posts', [
            'title' => 'My First Post',
            'user_id' => $user->id,
            // 'slug' => 'my-first-post' 
        ]);
    }

    public function test_users_can_see_paginated_posts()
    {
        // create posts
        $user = User::factory()->create();
        $category = Category::factory()->create();
        Post::factory()->count(15)->create([
            'user_id' => $user->id,
            'category_id' => $category->id
        ]);

        $response = $this->getJson('/api/posts');

        $response->assertStatus(200);
        $response->assertJsonCount(9, 'data'); //cause pagination limit is 9
    }

    
    public function test_user_can_update_their_own_post()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id, 'category_id' => $category->id]);

        $response = $this->actingAs($user)->putJson("/api/posts/{$post->id}", [
            'title' => 'Updated Title',
            'content' => 'New Content',
            'category_id' => $category->id
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('posts', ['title' => 'Updated Title']);
    }

    
    public function test_user_cannot_update_others_post()
    {
        $owner = User::factory()->create();
        $hacker = User::factory()->create();
        $category = Category::factory()->create();
        $post = Post::factory()->create(['user_id' => $owner->id, 'category_id' => $category->id]);

        $response = $this->actingAs($hacker)->putJson("/api/posts/{$post->id}", [
            'title' => 'Hacked Title',
            'content' => 'Content',
            'category_id' => $category->id
        ]);

        $response->assertStatus(403); // Forbidden
    }

    public function test_user_can_soft_delete_post()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id, 'category_id' => $category->id]);

        $response = $this->actingAs($user)->deleteJson("/api/posts/{$post->id}");

        $response->assertStatus(200);
        
        $this->assertSoftDeleted('posts', ['id' => $post->id]);
    }

    public function test_user_can_restore_soft_deleted_post()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id, 'category_id' => $category->id]);

        $post->delete();

        $response = $this->actingAs($user)->postJson("/api/posts/{$post->id}/restore");

        $response->assertStatus(200);
        $this->assertNotSoftDeleted('posts', ['id' => $post->id]);
    }
}