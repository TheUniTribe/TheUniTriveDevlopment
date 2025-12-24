<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;
use App\Models\Topic;

class TagSeeder extends Seeder
{
    public function run()
    {
        $topics = Topic::all();

        if ($topics->isEmpty()) {
            $this->command->warn('No topics found. Run TopicSeeder first.');
            return;
        }

        $tags = [
            // Web Development
            ['topic_id' => $topics->where('slug', 'web-development')->first()?->id ?? $topics->first()->id, 'name' => 'Laravel', 'slug' => 'laravel', 'description' => 'PHP framework for web artisans', 'is_active' => true, 'usage_count' => 150],
            ['topic_id' => $topics->where('slug', 'web-development')->first()?->id ?? $topics->first()->id, 'name' => 'React', 'slug' => 'react', 'description' => 'JavaScript library for building user interfaces', 'is_active' => true, 'usage_count' => 200],
            ['topic_id' => $topics->where('slug', 'web-development')->first()?->id ?? $topics->first()->id, 'name' => 'Vue.js', 'slug' => 'vue-js', 'description' => 'Progressive JavaScript framework', 'is_active' => true, 'usage_count' => 120],

            // Mobile Development
            ['topic_id' => $topics->where('slug', 'mobile-development')->first()?->id ?? $topics->first()->id, 'name' => 'React Native', 'slug' => 'react-native', 'description' => 'Framework for building native apps using React', 'is_active' => true, 'usage_count' => 100],
            ['topic_id' => $topics->where('slug', 'mobile-development')->first()?->id ?? $topics->first()->id, 'name' => 'Flutter', 'slug' => 'flutter', 'description' => 'Google\'s UI toolkit for building natively compiled applications', 'is_active' => true, 'usage_count' => 90],

            // Data Science
            ['topic_id' => $topics->where('slug', 'data-science')->first()?->id ?? $topics->first()->id, 'name' => 'Python', 'slug' => 'python', 'description' => 'Programming language for data analysis', 'is_active' => true, 'usage_count' => 180],
            ['topic_id' => $topics->where('slug', 'data-science')->first()?->id ?? $topics->first()->id, 'name' => 'Machine Learning', 'slug' => 'machine-learning', 'description' => 'AI technique for pattern recognition', 'is_active' => true, 'usage_count' => 140],

            // Entrepreneurship
            ['topic_id' => $topics->where('slug', 'entrepreneurship')->first()?->id ?? $topics->first()->id, 'name' => 'Startup', 'slug' => 'startup', 'description' => 'Building new businesses', 'is_active' => true, 'usage_count' => 110],
            ['topic_id' => $topics->where('slug', 'entrepreneurship')->first()?->id ?? $topics->first()->id, 'name' => 'Innovation', 'slug' => 'innovation', 'description' => 'Creating new ideas and solutions', 'is_active' => true, 'usage_count' => 95],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}
