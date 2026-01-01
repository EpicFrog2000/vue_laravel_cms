<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StaticUser;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function login(Request $request){
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = StaticUser::attempt($validated['email'], $validated['password']);
        if ($user) {
            Auth::login($user);
            $request->session()->put('auth', true);
            return response(200);
        }
        return response('Auth failed', 401);
    }

    
    public function logout(Request $request){
        $request->session()->forget('auth');
        $request->session()->invalidate();
        return response(200);
    }
}
