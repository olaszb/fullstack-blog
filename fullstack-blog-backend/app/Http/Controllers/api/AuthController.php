<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request){
        return 'works';
    }

    public function login(Request $request){
        return 'works';
    }

    public function logout(Request $request){
        return 'works';
    }
}
