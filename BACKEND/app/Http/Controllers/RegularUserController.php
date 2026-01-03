<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RegularUserController extends Controller
{
    public function index()
    {
        return view('regular_user.dashboard');
    }
}
