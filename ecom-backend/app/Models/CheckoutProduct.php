<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CheckoutProduct extends Model
{
    /** @use HasFactory<\Database\Factories\CheckoutProductFactory> */
    use HasFactory;
    public function checkout()
    {
        return $this->belongsTo(Checkout::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    protected $fillable = [
        'checkout_id',
        'product_id',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

}