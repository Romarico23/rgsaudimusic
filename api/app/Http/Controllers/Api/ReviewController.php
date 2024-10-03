<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function add(Request $request)
    {
        // Get the authenticated user's ID
        $user_id = auth('sanctum')->user()->id;

        // Validate the request
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'order_id' => 'required|exists:orders,id',
            'review' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 422);
        }

        // Check if the user has already reviewed this product in the context of the same order
        $existingReview = Review::where('user_id', $user_id)
            ->where('product_id', $request->product_id)
            ->where('order_id', $request->order_id) // Include order_id in the check
            ->first();

        if ($existingReview) {
            return response()->json(['message' => 'You have already reviewed this product for this order'], 403);
        }

        // Create the review with the order_id included
        Review::create([
            'product_id' => $request->product_id,
            'user_id' => $user_id,
            'rating' => $request->rating,
            'review' => $request->review,
            'order_id' => $request->order_id, // Include order_id when creating the review
        ]);

        return response()->json(['message' => 'Review added successfully'], 200);
    }


    public function index()
    {
        if (auth('sanctum')->check()) {
            // $cartItems = Cart::where('user_id', $user_id)->get();
            $user_id = auth('sanctum')->user()->id;

            $userProductReview = Product::with('reviews')
                                        // ->where('user_id', $user_id)
                                        ->get();

            return response()->json([
                'userProductReview' => $userProductReview,
            ], 200);
        } else {
            return response()->json([
                'message' => 'Login to View Cart Data',
            ], 401);
        }
    }

}
