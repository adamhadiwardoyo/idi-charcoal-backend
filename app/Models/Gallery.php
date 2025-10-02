<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Gallery extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    // --- PERBAIKAN DI SINI ---
    protected $fillable = ['path']; // Ubah dari 'url' menjadi 'path'

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['url'];

    /**
     * Get the full URL for the image.
     *
     * @return string
     */
    public function getUrlAttribute()
    {
        // Fungsi ini akan mengubah 'path' yang tersimpan di database
        // menjadi URL lengkap secara otomatis
        if ($this->attributes['path']) {
            return Storage::disk('public')->url($this->attributes['path']);
        }
        return null;
    }
}