<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Handle login request.
     */
    public function login(Request $request)
    {
        // dd($request->content);
        \Log::info('Login attempt', [
            'email' => $request->email,
            'session_id' => $request->session()->getId(),
            'csrf_token' => $request->header('X-CSRF-TOKEN'),
            'user_agent' => $request->userAgent(),
        ]);

        $credentials = $request->validate([
            'email' => ['required'],
            'password' => ['required'],
        ]);

        // Attempt login with email or username
        $loginField = filter_var($request->email, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $credentials[$loginField] = $request->email;

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            \Log::info('Login successful', [
                'email' => $request->email,
                'new_session_id' => $request->session()->getId(),
                'user_id' => Auth::id(),
            ]);
            // Set default content to 'home' if not provided
            $request->session()->put('content', $request->content ?? 'dashboard');
           return redirect()->route('home');
        }

        \Log::warning('Login failed - invalid credentials', [
            'email' => $request->email,
        ]);

        return back()->withErrors([
            'email' => 'These credentials do not match our records.',
        ])->onlyInput('email');
    }

    /**
     * Logout user.
     */
    public function logout(Request $request): RedirectResponse
    {
        \Log::info('Logout attempt', [
            'user_id' => Auth::id(),
            'session_id' => $request->session()->getId(),
            'csrf_token' => $request->header('X-CSRF-TOKEN'),
            'user_agent' => $request->userAgent(),
        ]);

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        \Log::info('Logout successful', [
            'new_session_id' => $request->session()->getId(),
        ]);

        return redirect('/'); // Redirect to the welcome page
    }
}
