<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BlogPost;

class BlogPostSeeder extends Seeder
{
    public function run()
    {
        BlogPost::insert([
            [
                'title' => 'Welcome to Our Blog',
                'content' => 'This is the first post on our blog. Stay tuned for more updates!',
                'author' => 'Admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Tips for Using Our Application',
                'content' => 'Here are some useful tips to get the most out of our app.',
                'author' => 'Admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
