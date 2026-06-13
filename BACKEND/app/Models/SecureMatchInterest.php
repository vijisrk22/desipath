<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SecureMatchInterest extends Model
{
    protected $table = 'sm_interests';

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'status',
        'sender_album_unlocked',
        'receiver_album_unlocked',
        'sender_requested_album',
        'receiver_requested_album',
        'sent_at',
        'step1_accepted_at',
        'step2_accepted_at'
    ];

    public $timestamps = true;

    protected $casts = [
        'sent_at' => 'datetime',
        'step1_accepted_at' => 'datetime',
        'step2_accepted_at' => 'datetime',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
