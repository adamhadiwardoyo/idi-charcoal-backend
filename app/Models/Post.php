<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'excerpt', 'content', 'image', 'date', 'category',
        'meta_title', 'meta_description', 'is_active',
        'language', // <-- Tambahkan ini
    ];

    // ... sisa kode model ...


    protected $casts = [
        'date' => 'date',
        'is_active' => 'boolean',
    ];

    // This is the new part!
    protected $appends = ['image_url'];

    public function contents(): HasMany
    {
        return $this->hasMany(PostContent::class);
    }

    // And this is the accessor method
    public function getImageUrlAttribute(): ?string
    {
        if ($this->attributes['image']) {
            return Storage::disk('public')->url($this->attributes['image']);
        }
        return null;
    }
}