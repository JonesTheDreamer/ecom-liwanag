<?php

namespace Database\Seeders;

use App\Models\Checkout;
use App\Models\Cart;
use App\Models\CheckoutProduct;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // $table->string('name');
        // $table->string('description');
        // $table->double('price');
        // $table->integer('stock');
        // $table->string('image');

        User::factory()->create([
            "name" => "store",
            "email" => "store@gmail.com",
            "password" => "admin123",
            "role" => "employee"
        ]);

        User::factory()->create([
            "name" => "John Doe",
            "email" => "doej@gmail.com",
            "password" => "johndoeiscute",
            "role" => "customer"
        ]);

        Product::factory()->create([
            'name' => "Waffle T-Shirt",
            'description' => "Experience breathable comfort and subtle texture with this versatile waffle t-shirt.",
            'price' => 300,
            'stock' => 24,
            'image' => Str::slug("Waffle T-Shirt") . '-1-592025.jpg',
            'isUsed' => true
        ]);

        Product::factory()->create([
            'name' => "Baggy Pants",
            'description' => "Embrace effortless style and unrestricted movement with these relaxed and roomy baggy pants.",
            'price' => 500,
            'stock' => 23,
            'image' => Str::slug("Baggy pants") . '-2-592025.jpg'
        ]);


        Product::factory()->create([
            'name' => "Durag",
            'description' => "Maintain your hairstyle and express your personal style with this essential durag.",
            'price' => 200,
            'stock' => 42,
            'image' => Str::slug("Durag") . '-3-592025.jpg',
            'isUsed' => true
        ]);

        Product::factory()->create([
            'name' => "Band T-Shirt",
            'description' => "Showcase your fandom and rock your unique style with this iconic My Chemical Romance t-shirt.",
            'price' => 400,
            'stock' => 9,
            'image' => Str::slug("Band T-Shirt") . '-4-592025.jpg',
            'isUsed' => true
        ]);

        Product::factory()->create([
            'name' => "Straight-cut pants",
            'description' => "Achieve a timeless and polished look with these classic straight-cut pants, perfect for any occasion.",
            'price' => 550,
            'stock' => 13,
            'image' => Str::slug("Straight-cut pants") . '-5-592025.jpg',
            'isUsed' => true
        ]);

        Checkout::factory()->create([
            'total_amount' => 950,
            "user_id" => 2,
            "date" => "2025-05-9",
        ]);

        CheckoutProduct::factory()->create([
            'checkout_id' => 1,
            'product_id' => 5,
            "quantity" => 1
        ]);

        CheckoutProduct::factory()->create([
            'checkout_id' => 1,
            'product_id' => 4,
            "quantity" => 1
        ]);

        Checkout::factory()->create([
            'total_amount' => 800,
            "user_id" => 2,
            "date" => "2025-05-9",
        ]);

        CheckoutProduct::factory()->create([
            'checkout_id' => 2,
            'product_id' => 1,
            "quantity" => 2
        ]);

        CheckoutProduct::factory()->create([
            'checkout_id' => 2,
            'product_id' => 3,
            "quantity" => 1
        ]);


        Cart::factory()->create([
            "user_id" => 2,
            "product_id" => 2,
            "quantity" => 2
        ]);
    }
}