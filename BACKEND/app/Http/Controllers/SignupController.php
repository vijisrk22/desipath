<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SignupController extends Controller
{
    public function showSignupPage()
    {
        // Return the signup page view
        return view('auth/signup');
    }
}
