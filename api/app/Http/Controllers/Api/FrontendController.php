<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class FrontendController extends Controller
{
    public function category()
    {
        $category = Category::where('status', '0')->get();
        return response()->json([
            'category' => $category,
        ], 200);
    }

    public function fetchProduct($slug)
    {
        $category = Category::where('slug', $slug)->where('status', '0')->first();
        if ($category) {
            $product = Product::where('category_id', $category->id)
                                ->with('reviews')
                                ->where('status', '0')
                                ->get();
            
            if ($product) {
                return response()->json([
                    'product_data'=>[
                        'product'=>$product,
                        'category'=>$category,
                    ],
                ], 200);
            } else {
                return response()->json([
                    'message'=>'No Product Available',
                ], 400);
            }
            
        } else {
            return response()->json([
                'message'=>'No Such Category Found',
            ], 404);
        }
    }

    public function viewProductDetail($category_slug, $product_slug)
    {
        $category = Category::where('slug', $category_slug)->where('status', '0')->first();
        if ($category) {
            $product = Product::where('category_id', $category->id)
                                ->where('slug', $product_slug)
                                ->with('reviews.user')
                                ->where('status', '0')
                                ->first();
            if ($product) {
                return response()->json([
                    'product'=>$product,
                ], 200);
            } else {
                return response()->json([
                    'message'=>'No Product Available',
                ], 400);
            }
            
        } else {
            return response()->json([
                'message'=>'No Such Category Found',
            ], 404);
        }
    }

    public function viewAllProducts()
    {
        $products = Product::where('status', '0')
                            ->with('reviews')
                            ->get();


        // Check if products exist
        if ($products->isNotEmpty()) {
            return response()->json([
                'products' => $products,
            ], 200);
        } else {
            return response()->json([
                'message' => 'No Products Available',
            ], 400);
        }
    }

}
