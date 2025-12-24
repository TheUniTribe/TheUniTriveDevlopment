<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{
    User,
    Interest,
    Topic,
    Tag,
    Community,
    CommunityTag,
    CommunityTierSetting
};

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🌱 Seeding platform data...');

        $users = $this->createUsers();
        $this->seedTierSettings();

        $this->seedInterestData('technology', 'Technology', '💻', 'professional', $users);
        $this->seedInterestData('business', 'Business', '💼', 'professional', $users);
        $this->seedInterestData('design', 'Design', '🎨', 'professional', $users);
        $this->seedInterestData('education', 'Education', '📚', 'student', $users);
        $this->seedInterestData('health-wellness', 'Health & Wellness', '🏥', 'student', $users);

        $this->command->info('✅ Database seeding completed successfully!');
    }

    /* ------------------------------------------------------------------
     | USERS
     |------------------------------------------------------------------*/

    private function createUsers(): array
    {
        return [
            'admin' => User::firstOrCreate(
                ['email' => 'admin@example.com'],
                ['username' => 'Admin', 'password' => bcrypt('password')]
            ),
            'creator1' => User::firstOrCreate(
                ['email' => 'creator1@example.com'],
                ['username' => 'John', 'password' => bcrypt('password')]
            ),
            'creator2' => User::firstOrCreate(
                ['email' => 'creator2@example.com'],
                ['username' => 'Jane', 'password' => bcrypt('password')]
            ),
            'creator3' => User::firstOrCreate(
                ['email' => 'creator3@example.com'],
                ['username' => 'Mike', 'password' => bcrypt('password')]
            ),
            'creator4' => User::firstOrCreate(
                ['email' => 'creator4@example.com'],
                ['username' => 'Sarah', 'password' => bcrypt('password')]
            ),
        ];
    }

    /* ------------------------------------------------------------------
     | COMMUNITY TIERS
     |------------------------------------------------------------------*/

    private function seedTierSettings(): void
    {
        foreach (
            [
                ['tier_name' => 'small', 'min_members' => 0, 'max_members' => 100, 'label' => 'Small', 'order' => 1],
                ['tier_name' => 'medium', 'min_members' => 101, 'max_members' => 1000, 'label' => 'Medium', 'order' => 2],
                ['tier_name' => 'large', 'min_members' => 1001, 'max_members' => 10000, 'label' => 'Large', 'order' => 3],
                ['tier_name' => 'enterprise', 'min_members' => 10001, 'max_members' => null, 'label' => 'Enterprise', 'order' => 4],
            ] as $tier
        ) {
            CommunityTierSetting::updateOrCreate(
                ['tier_name' => $tier['tier_name']],
                $tier
            );
        }
    }

    /* ------------------------------------------------------------------
     | INTEREST → TOPICS → COMMUNITIES → TAGS
     |------------------------------------------------------------------*/

    private function seedInterestData(
        string $interestSlug,
        string $interestName,
        string $icon,
        string $communityType,
        array $users
    ): void {

        /* -------------------- INTEREST -------------------- */
        $interest = Interest::firstOrCreate(
            ['slug' => $interestSlug],
            ['name' => $interestName, 'icon' => $icon, 'is_active' => true]
        );

        /* -------------------- TOPICS (20) -------------------- */
        $topics = collect();

        for ($i = 1; $i <= 20; $i++) {
            $topics->push(
                $interest->topics()->firstOrCreate(
                    ['slug' => "{$interestSlug}-topic-{$i}"],
                    ['name' => "{$interestName} Topic {$i}", 'is_active' => true]
                )
            );
        }

        /* -------------------- TAGS (20 – GLOBAL) -------------------- */
        $tags = collect();

        for ($i = 1; $i <= 20; $i++) {
            $tags->push(
                Tag::firstOrCreate(
                    ['slug' => "{$interestSlug}-tag-{$i}"],
                    ['name' => "{$interestName} Tag {$i}"]
                )
            );
        }

        $laravel = Tag::firstOrCreate(
            ['slug' => 'laravel'],
            ['name' => 'Laravel']
        );

        $react = Tag::firstOrCreate(
            ['slug' => 'react'],
            ['name' => 'React']
        );

        /* -------------------- COMMUNITIES (20) -------------------- */
        for ($i = 1; $i <= 20; $i++) {

            $creatorKey = 'creator' . (($i % 4) + 1);

            $community = Community::firstOrCreate(
                ['slug' => "{$interestSlug}-community-{$i}"],
                [
                    'name'         => "{$interestName} Community {$i}",
                    'description'  => "Community {$i} under {$interestName}",
                    'type'         => $communityType,
                    'visibility'   => 'public',
                    'join_policy'  => 'open',
                    'created_by'   => $users[$creatorKey]->id,
                    'owner_id'     => $users[$creatorKey]->id,
                    'status'       => 'published',
                    'published_at' => now()->subDays(rand(1, 365)),
                ]
            );

            /* Attach 1–2 Topics */
            $community->topics()->syncWithoutDetaching(
                $topics->random(rand(1, 2))->pluck('id')->toArray()
            );

            /* Attach 2 Tags via CommunityTag model ONLY */
            $pivot = new CommunityTag();

            foreach ($tags->random(2) as $tag) {
                $pivot->add([
                    'community_id' => $community->id,
                    'tag_id'       => $tag->id,
                ]);
            }
        }
    }
}
