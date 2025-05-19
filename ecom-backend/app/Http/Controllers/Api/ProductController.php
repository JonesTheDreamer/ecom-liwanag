<?php
namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json([
            "products" => Product::all()->map(function ($product) {
                $product->image_url = $product->image ? asset('storage/products/' . $product->image) : null;
                return $product;
            })
        ], 200);
    }

    public function store(Request $request)
    {
        if (auth()->user()->role !== "employee") {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        $product = Product::create($validated);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $date = Carbon::now()->format('mdY');
            $filename = Str::slug($product->name) . '-' . $product->id . '-' . $date . '.' . $image->getClientOriginalExtension();
            $image->storeAs('products', $filename, 'public');
            $product->image = $filename;
            $product->save();
        }

        $product->image_url = $product->image ? asset('storage/products/' . $product->image) : null;
        return response()->json(["product" => $product], 201);
    }

    public function show(Product $product)
    {
        $product->image_url = $product->image ? asset('storage/products/' . $product->image) : null;
        return response()->json(["product" => $product], 200);
    }

    public function update(Request $request, Product $product)
    {
        if (auth()->user()->role !== "employee") {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'isUsed' => 'sometimes|boolean',
            'image' => 'sometimes|image|max:2048',
        ]);

        $oldImage = $product->image;
        $nameChanged = isset($validated['name']) && $validated['name'] !== $product->name;

        $product->update($validated);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($oldImage) {
                Storage::disk("public")->delete('products/' . $oldImage);
            }

            // Upload new image
            $image = $request->file('image');
            $date = Carbon::now()->format('mdY');
            $filename = Str::slug($product->name) . '-' . $product->id . '-' . $date . '.' . $image->getClientOriginalExtension();
            $image->storeAs('products', $filename, 'public');
            $product->image = $filename;
            $product->save();
        } elseif ($nameChanged && $oldImage) {
            // Rename existing image if only name changed
            $date = Carbon::now()->format('mdY');
            $extension = pathinfo($oldImage, PATHINFO_EXTENSION);
            $newFilename = Str::slug($product->name) . '-' . $product->id . '-' . $date . '.' . $extension;

            if (Storage::disk("public")->exists('products/' . $oldImage)) {
                Storage::disk("public")->move('products/' . $oldImage, 'products/' . $newFilename);
                $product->image = $newFilename;
                $product->save();
            }
        }

        $product->image_url = $product->image ? asset('storage/products/' . $product->image) : null;
        return response()->json(["product" => $product], 200);
    }

    public function destroy(Product $product)
    {
        if (auth()->user()->role !== "employee") {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        if ($product->isUsed) {
            return response()->json(["message" => "Unable to delete the product"], 400);
        }

        if ($product->image) {
            Storage::delete('public/products/' . $product->image);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully.'], 200);
    }

}