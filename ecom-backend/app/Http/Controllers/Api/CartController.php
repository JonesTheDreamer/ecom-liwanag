<?php


namespace App\Http\Controllers\Api;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user->role !== 'customer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $carts = Cart::with('product')->where('user_id', $user->id)->get();

        $carts = $carts->map(function ($cart) {
            $product = $cart->product;
            return [
                'id' => $cart->id,
                'product' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'isUsed' => $product->isUsed,
                    'image_url' => $product->image ? asset('storage/products/' . $product->image) : null,
                ],
                'quantity' => $cart->quantity,
            ];
        });

        return response()->json(["carts" => $carts], 200);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'customer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Cart::where('user_id', $user->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($cart) {
            $cart->quantity += $validated['quantity'];
            $cart->save();
        } else {
            $cart = Cart::create([
                'user_id' => $user->id,
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
            ]);
        }

        return response()->json(['message' => 'Cart updated successfully', 'cart' => $cart], 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->role !== 'customer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cart = Cart::where('id', $id)->where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        if ($validated['quantity'] === 0) {
            $cart->delete();
            return response()->json(['message' => 'Cart item deleted due to zero quantity']);
        }

        $cart->quantity = $validated['quantity'];
        $cart->save();

        return response()->json(['message' => 'Cart quantity updated', 'cart' => $cart], 200);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        if ($user->role !== 'customer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cart = Cart::where('id', $id)->where('user_id', $user->id)->firstOrFail();
        $cart->delete();

        return response()->json(['message' => 'Cart item deleted'], 200);
    }
}