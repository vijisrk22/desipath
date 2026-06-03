<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImmigrationNews extends Model
{
    protected $table = 'immigration_news';

    protected $casts = [
        'published_at' => 'datetime',
        'original_published_at' => 'datetime',
        'tags_json' => 'array',
        'is_government_source' => 'boolean',
        'attorney_referral' => 'boolean',
        'ai_summary_is_fallback' => 'boolean',
    ];
}
