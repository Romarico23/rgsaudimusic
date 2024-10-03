<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::orderBy('created_at', 'desc')->get();
    
        return response()->json([
            'orders' => $orders,
        ], 200);
    }
    

    public function edit($id)
    {
         $order = Order::find($id);
        if ($order) {
            return response()->json([
                'order'=>$order,
            ], 200);
        } else {
            return response()->json([
                'message'=>'No Order Id Found',
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->only(['status', 'remark']), [
            'status' => 'required|integer|min:0|max:2', 
            'remark' => 'required|max:191',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors'=>$validator->messages(),
            ], 422);
        } else {
            $order = Order::findOrFail($id);

            if ($order) {
                $order->remark = $request->input('remark');
                $order->status = $request->input('status');
                $order->update();
    
                return response()->json([
                    'message'=>'Order Updated Successfully',
                ], 200);

            } else {
                return response()->json([
                    'message'=>'Product Not Found',
                ], 404);
            }
        }
    }

    public function indexByOrderItems()
    {
        // Retrieve orders with order items and associated products, sorted by the newest orders
        if (auth('sanctum')->check()) {
            $ordersWithOrderItems = Order::with('orderItems.product')
                ->orderBy('created_at', 'desc') // Sort by created_at in descending order
                ->get();

            return response()->json([
                'ordersWithOrderItems' => $ordersWithOrderItems,
            ], 200);
        } else {
            return response()->json([
                'message' => 'Login to View Cart Data',
            ], 401);
        }
    }

    public function indexByUserOrderItems()
    {
        if (auth('sanctum')->check()) {
            $user_id = auth('sanctum')->user()->id;
    
            // Fetch user's orders with order items and their reviews
            $userProductReview = Order::with(['orderItems.product.reviews' => function ($query) use ($user_id) {
                // Get only the reviews made by the current user and order by created_at (newest first)
                $query->where('user_id', $user_id)
                    ->orderBy('created_at', 'desc');
            }])
            // Sort orders by creation date (newest to oldest)
            ->where('user_id', $user_id)
            ->orderBy('created_at', 'desc') // Sort orders from newest to oldest
            ->get();
    
            // Attach an "isReviewed" flag and order_id to each product
            foreach ($userProductReview as $order) {
                foreach ($order->orderItems as $item) {
                    // Check if the product still exists (not deleted)
                    if ($item->product) {
                        // Check if the product has been reviewed by the user for the specific order
                        $item->isReviewed = $item->product->reviews->contains(function ($review) use ($user_id, $order) {
                            return $review->user_id === $user_id && $review->order_id === $order->id;
                        });
    
                        // Optionally attach reviews to the order items
                        $item->reviews = $item->product->reviews->where('order_id', $order->id)->values();
                    } else {
                        // If the product is null (deleted), mark the item appropriately
                        $item->isReviewed = false; // Or handle this flag based on your business logic
                        $item->reviews = []; // Set reviews to an empty array
                    }
                }
            }
    
            return response()->json([
                'userProductReview' => $userProductReview,
            ], 200);
        } else {
            return response()->json([
                'message' => 'Login to View Order Data',
            ], 401);
        }
    }
    

}
