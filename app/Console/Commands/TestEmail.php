<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class TestEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:email {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test email configuration by sending a test email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');

        try {
            Mail::raw('This is a test email from your Laravel application. Email verification is working!', function ($message) use ($email) {
                $message->to($email)
                    ->subject('Test Email - Laravel Email Verification');
            });

            $this->info('Test email sent successfully to: ' . $email);
        } catch (\Exception $e) {
            $this->error('Failed to send email: ' . $e->getMessage());
            Log::error('Email test failed: ' . $e->getMessage());
        }
    }
}
