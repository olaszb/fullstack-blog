<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'thumbnail',
        'category_id',
        'user_id',
        'published_at'
    ];

    protected $appends = ['excerpt', 'thumbnail_url'];

    public function getThumbnailUrlAttribute()
    {
        if ($this->thumbnail) {
            return asset('storage/' . $this->thumbnail);            
        }
        
        return null;
    }

    public function getExcerptAttribute()
    {
        $html = Str::markdown($this->content);
        
        $plainText = strip_tags($html);
        
        $plainText = str_replace(["\r", "\n"], ' ', $plainText);

        return Str::limit($plainText, 100);
    }

    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }
}
