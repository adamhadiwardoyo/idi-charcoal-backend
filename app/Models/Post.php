<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
    'slug', 'title', 'excerpt', 'image', 'date', 'category', 'meta_title', 'meta_description'
    ];

    public function contents()
    {
        return $this->hasMany(PostContent::class);
    }
}
