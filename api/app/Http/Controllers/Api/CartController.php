<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        if (auth('sanctum')->check()) {
            $user_id = auth('sanctum')->user()->id;
            $product_id = $request->product_id;
            $product_quantity = $request->product_quantity;
        
            $productCheck = Product::where('id', $product_id)->first();
        
            if ($productCheck) {
                if (Cart::where('product_id', $product_id)->where('user_id', $user_id)->exists()) {
                    return response()->json([
                        'message' => $productCheck->name . ' - Already Added to Cart',
                    ], 409);
                } else {
                    $cartItem = new Cart;
                    $cartItem->user_id = $user_id;
                    $cartItem->product_id = $product_id;
                    $cartItem->product_quantity = $product_quantity;
                    $cartItem->save();
                
                    return response()->json([
                        'message' => 'Added to Cart',
                    ], 201);
                }
            } else {
                return response()->json([
                    'message' => 'Product Not Found',
                ], 404);
            }
        } else {
            return response()->json([
                'message' => 'Login to Add to Cart',
            ], 401);
        }
    }
    
    public function viewCart()
    {
        if (auth('sanctum')->check()) {
            $user_id = auth('sanctum')->user()->id;
            $cartItems = Cart::where('user_id', $user_id)->get();
        
            return response()->json([
                'cart' => $cartItems,
            ], 200);
        } else {
            return response()->json([
                'message' => 'Login to View Cart Data',
            ], 401);
        }
    }

    public function updateQuantity($cart_id, $scope)
    {
        if (auth('sanctum')->check()) {
            $user_id = auth('sanctum')->user()->id;
            $cartItem = Cart::where('id', $cart_id)->where('user_id', $user_id)->first();
    
            switch ($scope) {
                case 'inc':
                    $cartItem->product_quantity += 1;
                    break;
    
                case 'dec':
                    if ($cartItem->product_quantity > 1) {
                        $cartItem->product_quantity -= 1;
                    } else {
                        return response()->json([
                            'message' => 'Quantity cannot be less than 1',
                        ], 401);
                    }
                    break;
    
                default:
                    return response()->json([
                        'message' => 'Invalid scope provided',
                    ], 400);
            }
    
            $cartItem->update();
    
            return response()->json([
                'message' => 'Quantity Updated',
            ], 200);
        } else {
            return response()->json([
                'message' => 'Login to continue',
            ], 401);
        }
    }

    public function deleteCartItem($cart_id)
    {
        if (auth('sanctum')->check()) {
            $user_id = auth('sanctum')->user()->id;

            $cartItem = Cart::where('id', $cart_id)->where('user_id', $user_id)->first();

            if ($cartItem) {
                $cartItem->delete();

                return response()->json([
                    'message' => 'Cart Item Removed Successfully.',
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Cart Item not Found',
                ], 404);
            }
        } else {
            return response()->json([
                'message' => 'Login to continue',
            ], 401);
        }
    }
}    
