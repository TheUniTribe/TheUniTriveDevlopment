<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    /**
     * Redirect the user to the OAuth Provider.
     *
     * @param string $provider
     * @return \Illuminate\Http\Response
     */
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    /**
     * Obtain the user information from provider.
     *
     * @param string $provider
     * @return \Illuminate\Http\Response
     */
    public function handleProviderCallback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            return redirect('')->withErrors(['msg' => 'Unable to login using ' . $provider . '. Please try again.']);
        }

        // Find or create user
        $user = User::where('email', $socialUser->getEmail())->first();

        if (!$user) {
            // Generate a unique username
            $baseUsername = Str::slug($socialUser->getName() ?? $socialUser->getNickname() ?? 'user');
            $username = $baseUsername;
            $counter = 1;
            while (User::where('username', $username)->exists()) {
                $username = $baseUsername . $counter;
                $counter++;
            }

            // Split name into first and last name
            $fullName = $socialUser->getName() ?? $socialUser->getNickname() ?? 'User';
            $nameParts = explode(' ', $fullName, 2);
            $firstName = $nameParts[0] ?? 'User';
            $lastName = $nameParts[1] ?? '';

            $user = User::create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'username' => $username,
                'email' => $socialUser->getEmail(),
                'password' => bcrypt(Str::random(16)), // random password
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'avatar' => $socialUser->getAvatar(),
            ]);
        } else {
            // Update social login data if user exists but doesn't have it
            if (!$user->provider) {
                $user->update([
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                ]);
            }
            // If username is missing, generate one
            if (!$user->username) {
                $baseUsername = Str::slug($user->name ?? 'user');
                $username = $baseUsername;
                $counter = 1;
                while (User::where('username', $username)->where('id', '!=', $user->id)->exists()) {
                    $username = $baseUsername . $counter;
                    $counter++;
                }
                $user->update(['username' => $username]);
            }
        }

        Auth::login($user, true);

        return redirect()->intended('/home');
    }
}
