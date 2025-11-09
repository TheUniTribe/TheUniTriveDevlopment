<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;
use Faker\Factory as Faker;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $now = Carbon::now();

        $platforms = [
            'twitter', 'linkedin', 'instagram', 'facebook', 'youtube',
            'tiktok', 'github', 'website', 'custom'
        ];

        $usersToInsert = [];
        $experiencesToInsert = [];
        $educationsToInsert = [];
        $linksToInsert = [];

        // credentials to dump (username,email,plain_password)
        $credentials = [];

        // Create 100 users
        for ($i = 0; $i < 100; $i++) {
            $gender = $faker->randomElement(['male', 'female', 'other', 'prefer_not_to_say']);
            $firstName = $faker->firstName();
            $lastName  = $faker->lastName();
            $username = Str::slug($firstName . '-' . $lastName . '-' . $faker->unique()->numberBetween(1,9999));
            $email = $faker->unique()->safeEmail();

            // generate a unique plain password per user (you can use a fixed password if you prefer)
            $plainPassword = 'password';
             // e.g. 8-12 char random password
            // for easier testing, you could set $plainPassword = 'password';

            $usersToInsert[] = [
                'username' => $username,
                'email' => $email,
                'email_verified_at' => $faker->boolean(85) ? $now->subDays($faker->numberBetween(0, 365))->toDateTimeString() : null,
                'password' => Hash::make($plainPassword),
                'profile_picture' => $faker->boolean(70) ? $faker->imageUrl(200, 200, 'people') : null,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'title' => $faker->boolean(60) ? $faker->jobTitle() : null,
                'bio' => $faker->boolean(60) ? $faker->paragraph() : null,
                'about' => $faker->boolean(50) ? $faker->text(300) : null,
                'website_url' => $faker->boolean(40) ? $faker->url() : null,
                'phone' => $faker->boolean(40) ? $faker->phoneNumber() : null,
                'phone_verified_at' => $faker->boolean(30) ? $now->subDays($faker->numberBetween(0, 365))->toDateTimeString() : null,
                'date_of_birth' => $faker->boolean(70) ? $faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d') : null,
                'gender' => $gender,
                'location' => $faker->city() . ', ' . $faker->country(),
                'account_type' => $faker->randomElement(['free', 'premium']),
                'account_status' => $faker->randomElement(['active', 'inactive', 'suspended', 'deactivated']),
                'is_verified' => $faker->boolean(80),
                'two_factor_enabled' => $faker->boolean(20),
                'two_factor_secret' => $faker->boolean(20) ? Str::random(32) : null,
                'password_reset_token' => null,
                'password_reset_expires' => null,
                'last_activity_at' => $faker->boolean(70) ? $faker->dateTimeBetween('-2 weeks', 'now')->format('Y-m-d H:i:s') : null,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            // store creds for CSV (we cannot know the db id yet since we bulk insert)
            $credentials[] = [
                'username' => $username,
                'email' => $email,
                'password' => $plainPassword,
            ];
        }

        DB::beginTransaction();
        try {
            // insert users
            DB::table('users')->insert($usersToInsert);

            // fetch the 100 most recently inserted users (safe on a fresh DB)
            $users = DB::table('users')->orderByDesc('id')->limit(100)->get();

            // build related records (same approach as before)
            foreach ($users as $user) {
                // EXPERIENCES: 1 - 3 per user
                $expCount = $faker->numberBetween(1, 3);
                for ($e = 0; $e < $expCount; $e++) {
                    $startDate = $faker->dateTimeBetween('-10 years', '-2 years');
                    $endDate = $faker->boolean(60) ? $faker->dateTimeBetween($startDate, 'now') : null;

                    $experiencesToInsert[] = [
                        'user_id' => $user->id,
                        'title' => $faker->jobTitle(),
                        'company' => $faker->company(),
                        'location' => $faker->city(),
                        'start_date' => Carbon::instance($startDate)->format('Y-m-d'),
                        'end_date' => $endDate ? Carbon::instance($endDate)->format('Y-m-d') : null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }

                // EDUCATIONS: 1 - 2 per user
                $eduCount = $faker->numberBetween(1, 2);
                for ($ed = 0; $ed < $eduCount; $ed++) {
                    $startYear = $faker->numberBetween(1990, 2018);
                    $endYear = $faker->boolean(85) ? $faker->numberBetween($startYear, min($startYear + 8, (int)$now->format('Y'))) : null;

                    $educationsToInsert[] = [
                        'user_id' => $user->id,
                        'institution' => $faker->company() . ' University',
                        'degree' => $faker->boolean(80) ? $faker->randomElement([
                            'BSc Computer Science', 'BA Economics', 'MBA', 'MSc Information Systems', 'PhD Engineering'
                        ]) : null,
                        'specialization' => $faker->boolean(70) ? $faker->randomElement([
                            'Software Engineering', 'Data Science', 'Business Management', 'Finance', 'AI Research'
                        ]) : null,
                        'start_year' => $startYear,
                        'end_year' => $endYear,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }

                // LINKS: 2 - 5 per user (unique platforms per user)
                $linkCount = $faker->numberBetween(2, 5);
                $availablePlatforms = $platforms;
                shuffle($availablePlatforms);
                $chosenPlatforms = array_slice($availablePlatforms, 0, $linkCount);

                foreach ($chosenPlatforms as $platform) {
                    $url = match ($platform) {
                        'twitter' => 'https://twitter.com/' . $faker->userName(),
                        'linkedin' => 'https://linkedin.com/in/' . $faker->userName(),
                        'instagram' => 'https://instagram.com/' . $faker->userName(),
                        'facebook' => 'https://facebook.com/' . $faker->userName(),
                        'youtube' => 'https://youtube.com/' . $faker->slug(),
                        'tiktok' => 'https://tiktok.com/@' . $faker->userName(),
                        'github' => 'https://github.com/' . $faker->userName(),
                        'website' => $faker->url(),
                        'custom' => $faker->url(),
                        default => $faker->url(),
                    };

                    $linksToInsert[] = [
                        'user_id' => $user->id,
                        'platform' => $platform,
                        'url' => Str::limit($url, 512, ''),
                        'label' => $platform === 'custom' ? $faker->words(2, true) : null,
                        'is_public' => $faker->boolean(90),
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }

            // Bulk insert related records
            $this->chunkInsert('user_experiences', $experiencesToInsert);
            $this->chunkInsert('user_educations', $educationsToInsert);
            $this->chunkInsert('user_links', $linksToInsert);

            DB::commit();

            // Write credentials to CSV (storage/app/seeded_users_credentials.csv)
            $csvLines = ["username,email,password"];
            foreach ($credentials as $c) {
                $csvLines[] = implode(',', [
                    str_replace(',', '', $c['username']),
                    str_replace(',', '', $c['email']),
                    str_replace(',', '', $c['password']),
                ]);
            }
            File::put(storage_path('app/seeded_users_credentials.csv'), implode("\n", $csvLines));

            $this->command->info('Seeding completed and credentials saved to storage/app/seeded_users_credentials.csv');
        } catch (\Exception $ex) {
            DB::rollBack();
            $this->command->error('Seeding failed: ' . $ex->getMessage());
            throw $ex;
        }
    }

    protected function chunkInsert(string $table, array $rows, int $chunkSize = 500): void
    {
        if (empty($rows)) {
            return;
        }
        $chunks = array_chunk($rows, $chunkSize);
        foreach ($chunks as $chunk) {
            DB::table($table)->insert($chunk);
        }
    }
}
