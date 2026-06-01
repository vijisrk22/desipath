<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ForumSubforum extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'icon'];

    protected static function booted()
    {
        static::creating(function ($subforum) {
            if (!$subforum->slug) {
                $subforum->slug = Str::slug($subforum->name);
            }
        });
    }
}
