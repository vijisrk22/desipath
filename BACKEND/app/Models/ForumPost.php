<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Str;

class ForumPost extends Model
{
    protected $fillable = ['user_id', 'title', 'slug', 'content', 'category', 'votes'];

    protected static function booted()
    {
        static::creating(function ($post) {
            $post->slug = Str::slug($post->title) . '-' . Str::random(5);
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(ForumComment::class, 'post_id');
    }
}
