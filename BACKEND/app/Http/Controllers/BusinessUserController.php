<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BusinessUserController extends Controller
{
    public function index()
    {
        return view('business_user.dashboard');
    }
}
