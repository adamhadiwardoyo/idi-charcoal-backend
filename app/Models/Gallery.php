<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Gallery extends Model
{
    protected $fillable = ['path', 'url'];

    protected $appends = ['url'];

    public function getUrlAttribute(): ?string
    {
        if ($this->attributes['path']) {
            return Storage::disk('public')->url($this->attributes['path']);
        }
        return null;
    }
}