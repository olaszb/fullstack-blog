<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
            'token' => $token->plainTextToken,
        ];
    }

    public function login(Request $request){
        $request->validate([
            'email' => 'email|required|exists:users',
            'password' => 'required',
        ]);
        
        $user = User::where('email', $request->email)->first();

        if(!$user || !Hash::check($request->password, $user->password)){
            return [
                'message' => 'The provided credentials are incorrect',
            ];
        }
        $token = $user->createToken($user->name);
        
        return [
            'user' => $user,
            'token' => $token->plainTextToken,
        ];
    }

    public function logout(Request $request){
        return 'works';
    }
}
