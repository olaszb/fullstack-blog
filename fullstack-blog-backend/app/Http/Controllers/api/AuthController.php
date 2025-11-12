<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request){
        $data = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email',
            'password' => ['required','min:8', 'regex:/[A-Z]/', 'unique:users', 'confirmed'],
        ]);

        $user = User::create($data);

        $token = $user->createToken($request->name);

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function login(Request $request){
        return 'works';
    }

    public function logout(Request $request){
        return 'works';
    }
}
