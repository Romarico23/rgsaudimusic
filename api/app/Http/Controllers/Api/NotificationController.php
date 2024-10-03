<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;

class NotificationController extends Controller
{
    public function edit($orderId)
    {
        if (auth('sanctum')->check()) {
            // Find the order by its ID
            $order = Order::find($orderId);

            if ($order) {
                // Update notif_status to 1 (marked as read)
                $order->notif_status = 1;
                $order->save();

                return response()->json([
                    'message' => 'Notification marked as read.',
                    'order' => $order,
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Order not found.',
                ], 404);
            }
        } else {
            return response()->json([
                'message' => 'Unauthorized access.',
            ], 401);
        }
    }
}
