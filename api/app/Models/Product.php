<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';
    protected $fillable = [
        'category_id',
        'meta_title',
        'meta_keywords',
        'meta_description',
        'slug',
        'name',
        'description',
        'brand',
        'selling_price',
        'original_price',
        'quantity',
        'images',
        'featured',
        'popular',
        'status',
    ]; 

    protected $casts = [
        'images' => 'array',
    ];
    protected $with = ['category'];
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }
    public function orderItems()
    {
        return $this->hasMany(Orderitems::class, 'product_id');
    }
    public function reviews()
    {
        return $this->hasMany(Review::class, 'product_id',);
    }
}
