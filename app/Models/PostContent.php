<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostContent extends Model
{
Protected $fillable = ['post_id', 'type', 'text', 'items'];

protected $casts = [
    'items' => 'array', // Automatically cast the 'items' JSON to an array
];

public function post()
{
    return $this->belongsTo(Post::class);
}
}
