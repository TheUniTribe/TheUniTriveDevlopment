<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GroupTag;
use App\Models\Group;
use App\Models\Tag;

class GroupTagSeeder extends Seeder
{
    public function run()
    {
        $groups = Group::all();
        $tags = Tag::all();

        if ($groups->isEmpty() || $tags->isEmpty()) {
            $this->command->warn('No groups or tags found. Run GroupSeeder and TagSeeder first.');
            return;
        }

        $groupTags = [
            // Laravel Developers Community
            ['group_id' => $groups->where('slug', 'laravel-developers-community')->first()?->id ?? $groups->first()->id, 'tag_id' => $tags->where('slug', 'laravel')->first()?->id ?? $tags->first()->id],
            ['group_id' => $groups->where('slug', 'laravel-developers-community')->first()?->id ?? $groups->first()->id, 'tag_id' => $tags->where('slug', 'php')->first()?->id ?? $tags->first()->id],

            // React Study Squad
            ['group_id' => $groups->where('slug', 'react-study-squad')->first()?->id ?? $groups->first()->id, 'tag_id' => $tags->where('slug', 'react')->first()?->id ?? $tags->first()->id],
            ['group_id' => $groups->where('slug', 'react-study-squad')->first()?->id ?? $groups->first()->id, 'tag_id' => $tags->where('slug', 'javascript')->first()?->id ?? $tags->first()->id],

            // Data Science Hub
            ['group_id' => $groups->where('slug', 'data-science-hub')->first()?->id ?? $groups->first()->id, 'tag_id' => $tags->where('slug', 'python')->first()?->id ?? $tags->first()->id],
            ['group_id' => $groups->where('slug', 'data-science-hub')->first()?->id ?? $groups->first()->id, 'tag_id' => $tags->where('slug', 'machine-learning')->first()?->id ?? $tags->first()->id],

            // Startup Founders Network
            ['group_id' => $groups->where('slug', 'startup-founders-network')->first()?->id ?? $groups->first()->id, 'tag_id' => $tags->where('slug', 'startup')->first()?->id ?? $tags->first()->id],
            ['group_id' => $groups->where('slug', 'startup-founders-network')->first()?->id ?? $groups->first()->id, 'tag_id' => $tags->where('slug', 'innovation')->first()?->id ?? $tags->first()->id],
        ];

        foreach ($groupTags as $groupTag) {
            GroupTag::create($groupTag);
        }
    }
}
