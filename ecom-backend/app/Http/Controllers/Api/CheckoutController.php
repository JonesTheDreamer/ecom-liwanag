<?php
namespace App\Http\Controllers\Api;

use App\Models\Cart;
use App\Models\Checkout;
use App\Models\CheckoutProduct;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CheckoutController extends Controller
{
    /**
     * Get all checkouts with user and product details
     */
    public function index()
    {
        if (auth()->user()->role !== "employee") {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        $checkouts = Checkout::all();

        return response()->json([
            "checkouts" => $checkouts->map(function ($checkout) {
                $checkout->user;
                $checkout->checkoutProducts->map(function ($cp) {
                    $product = $cp->product;
                    if ($product) {
                        $product->image_url = $product->image ? asset('storage/products/' . $product->image) : null;
                    }
                    return [
                        'product' => $product,
                        'quantity' => $cp->quantity,
                    ];
                });
                return $checkout;
            })
        ]);
    }

    /**
     * Get a specific checkout with user and product details
     */
    public function show()
    {
        if (auth()->user()->role !== "customer") {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        $user = auth()->user();

        $checkouts = Checkout::where('user_id', $user->id)->get();

        return response()->json([
            "checkouts" =>
                $checkouts->map(function ($checkout) {
                    $checkout->checkoutProducts->map(function ($cp) {
                        $product = $cp->product;
                        if ($product) {
                            $product->image_url = $product->image ? asset('storage/products/' . $product->image) : null;
                        }
                        return [
                            'product' => $product,
                            'quantity' => $cp->quantity,
                        ];
                    });
                    return $checkout;
                })
        ]);
    }

    /**
     * Store a new checkout and associated products
     */

    public function store(Request $request)
    {
        if (auth()->user()->role !== "customer") {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $validated = $request->validate([
            'date' => 'required|date',
            'total_amount' => 'required|numeric|min:0',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            // Check stock availability
            foreach ($validated['products'] as $item) {
                $product = Product::find($item['product_id']);
                if ($product->stock < $item['quantity']) {
                    return response()->json([
                        'message' => "Insufficient stock for product '{$product->name}'. Available: {$product->stock}, Requested: {$item['quantity']}"
                    ], 422);
                }
            }

            // Store checkout
            $checkout = Checkout::create([
                'date' => Carbon::parse($validated['date']),
                'total_amount' => $validated['total_amount'],
                'user_id' => auth()->user()->id,
            ]);

            // Store checkout_products and update stock
            foreach ($validated['products'] as $item) {
                CheckoutProduct::create([
                    'checkout_id' => $checkout->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);

                // Decrease product stock
                $product = Product::find($item['product_id']);
                $product->stock -= $item['quantity'];
                if (!$product->isUsed) {
                    $product->isUsed = true;
                }
                $product->save();

                $cart = Cart::where('user_id', auth()->user()->id)
                    ->where('product_id', $item['product_id'])
                    ->first();
                $cart->delete();
            }

            DB::commit();

            return response()->json([
                'message' => 'Checkout created successfully',
                'checkout_id' => $checkout->id,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create checkout', 'details' => $e->getMessage()], 500);
        }
    }

}