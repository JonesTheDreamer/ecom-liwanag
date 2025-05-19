<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;
    public function checkoutProducts()
    {
        return $this->hasMany(CheckoutProduct::class);
    }

    public function cart()
    {
        return $this->hasMany(Cart::class);
    }
    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'image',
        'isUsed',
    ];

    protected $casts = [
        'price' => 'double',
        'stock' => 'integer',
        'isUsed' => 'boolean',
    ];
}