<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class CheckoutController extends Controller
{
    public function placeOrder(Request $request)
{
    if (auth('sanctum')->check()) {
        $validator = Validator::make($request->all(), [
            'firstname' => 'required|max:191',
            'lastname' => 'required|max:191',
            'phone' => 'required|max:191',
            'email' => 'required|email|max:191',
            'address' => 'required|max:191',
            'city' => 'required|max:191',
            'state' => 'required|max:191',
            'zipcode' => 'required|max:191',
            'order_items' => 'required|array',
            'order_items.*.cart_id' => 'required',
            'order_items.*.product_id' => 'required',
            'order_items.*.quantity' => 'required|integer|min:1',
            'order_items.*.price' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->messages(),
            ], 422);
        }

        $user_id = auth('sanctum')->user()->id;

        $order = new Order();
        $order->user_id = $user_id;
        $order->firstname = $request->firstname;
        $order->lastname = $request->lastname;
        $order->phone = $request->phone;
        $order->email = $request->email;
        $order->address = $request->address;
        $order->city = $request->city;
        $order->state = $request->state;
        $order->zipcode = $request->zipcode;
        $order->payment_mode = $request->payment_mode;
        $order->payment_id = $request->payment_id;
        $order->tracking_no = 'rgsaudimusic_' . rand(1111, 9999);
        $order->save();

        $cart = Cart::where('user_id', $user_id)->get();

        $orderItems = [];
        $orderedProductIds = []; 

        foreach ($request->input('order_items') as $item) {
            $orderItems[] = [
                'cart_id' => $item['cart_id'],
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ];

            $product = Product::find($item['product_id']);
            if ($product) {
                if ($product->quantity < $item['quantity']) {
                    return response()->json([
                        'message' => 'Not enough stock for this product',
                    ], 400);
                }
                $product->decrement('quantity', $item['quantity']);
            }

            $orderedProductIds[] = $item['cart_id'];
        }

            $order->orderItems()->createMany($orderItems);

            foreach ($cart as $item) {
                if (in_array($item->id, $orderedProductIds)) {
                    $item->delete();
                }
            }
        

        return response()->json([
            'message' => 'Order Placed Successfully',
        ], 200);
    } else {
        return response()->json([
            'message' => 'Login to Continue',
        ], 401);
    }
}

    public function validateOrder(Request $request)
    {
        if (auth('sanctum')->check()) {
            $validator = Validator::make($request->all(), [
                'firstname'=>'required|max:191',
                'lastname'=>'required|max:191',
                'phone'=>'required|max:191',
                'email'=>'required|email|max:191',
                'address'=>'required|max:191',
                'city'=>'required|max:191',
                'state'=>'required|max:191',
                'zipcode'=>'required|max:191',
                'amount'=>'required',
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'errors' => $validator->messages(),
                    'message' => 'Incomplete order details.'
                ], 422);
            } else {

                if ($request->payment_mode === 'stripepay') {
                    Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

                    $paymentIntent = PaymentIntent::create([
                        'amount' => $request->amount * 100, 
                        'currency' => 'usd',
                    ]);

                    return response()->json([
                        'message' => 'Form Validated Successfully',
                        'clientSecret' => $paymentIntent->client_secret,
                    ], 200);

                } 
                else if ($request->payment_mode === 'payonline'){
                    return response()->json([
                        'message' => 'payonline',
                    ], 200);
                }
            }
        
        } else {
            return response()->json([
                'message' => 'Login to Continue',
            ], 401);
        }
    }

}
