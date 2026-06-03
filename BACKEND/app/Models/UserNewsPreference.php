<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserNewsPreference extends Model
{
    protected $table = 'user_news_preferences';
    protected $primaryKey = 'user_id';
    public $incrementing = false;
}
