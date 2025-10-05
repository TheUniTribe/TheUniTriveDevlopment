<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;

class ArticleSeeder extends Seeder
{
    public function run()
    {
        Article::insert([
            [
                'title' => 'Getting Started with Our Application',
                'content' => 'This article will help you get started quickly.',
                'author' => 'Admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Advanced Features Explained',
                'content' => 'Learn about the advanced features of our app.',
                'author' => 'Admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
