<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsDedupHash extends Model
{
    protected $table = 'news_dedup_hashes';
    protected $primaryKey = 'hash';
    protected $keyType = 'string';
    public $incrementing = false;
}
