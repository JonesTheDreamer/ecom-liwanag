<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::group(["prefix" => "user"], function () {
    Route::post("/", [UserController::class, "register"]);
    Route::post("/login", [UserController::class, "login"]);
    Route::post("/logout", [UserController::class, "logout"])->middleware("auth:sanctum");
});

Route::get("/product", [ProductController::class, "index"]);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/checkout/byUser', [CheckoutController::class, "show"]);
    Route::apiResource('checkout', CheckoutController::class)->except(["show"]);
    Route::apiResource('product', ProductController::class)->except(["index"]);
    Route::apiResource('cart', CartController::class);
});