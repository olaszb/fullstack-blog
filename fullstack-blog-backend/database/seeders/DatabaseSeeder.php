<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $categories = [
            'Technology',
            'Health',
            'Science',
            'Sports',
            'Gaming',
            'Anime',
            'Manga',
            'Literature',
            'Music'
        ];

        foreach($categories as $category){
            Category::create(
                [
                    'name'=> $category,
                ]
                );
        }

        Post::factory(20)->create();
    }
}
