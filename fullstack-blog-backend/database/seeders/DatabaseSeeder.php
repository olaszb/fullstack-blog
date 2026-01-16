<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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
            'password' => Hash::make("Test1234")
        ]);

        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'a@a.a',
            'password' => Hash::make("Admin1234"),
            'role' => 'admin',
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
