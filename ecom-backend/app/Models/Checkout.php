<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Checkout extends Model
{
    /** @use HasFactory<\Database\Factories\CheckoutFactory> */
    use HasFactory;
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function checkoutProducts()
    {
        return $this->hasMany(CheckoutProduct::class);
    }

    protected $fillable = [
        'date',
        'total_amount',
        'user_id',
    ];

    protected $casts = [
        'date' => 'date',
        'total_amount' => 'double',
    ];

}