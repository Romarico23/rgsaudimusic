<?php

use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\VisitController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\FrontendController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

// Auth
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('userProfile', [AuthController::class, 'index']);

// Instruments
Route::get('getCategory', [FrontendController::class, 'category']);
Route::get('fetchProduct/{slug}', [FrontendController::class, 'fetchProduct']);
Route::get('viewProductDetail/{category_slug}/{product_slug}', [FrontendController::class, 'viewProductDetail']);
Route::post('add-to-cart', [CartController::class, 'addToCart']);

// Cart
Route::get('cart', [CartController::class, 'viewCart']);
Route::post('cart-update-quantity/{cart_id}/{scope}', [CartController::class, 'updateQuantity']);
Route::delete('delete-cartItem/{cart_id}', [CartController::class, 'deleteCartItem']);

// Checkout
Route::post('place-order', [CheckoutController::class, 'placeorder']);
Route::post('validate-order', [CheckoutController::class, 'validateOrder']);

// Order
Route::get('viewUserOrderItems', [OrderController::class, 'indexByUserOrderItems']);

// Home
Route::get('viewAllProducts', [FrontendController::class, 'viewAllProducts']);

// Search
Route::get('products-search', [SearchController::class, 'search']);

// Visit
Route::post('visits', [VisitController::class, 'store']);
Route::get('visits-total', [VisitController::class, 'totalVisits']);
Route::get('visits-monthly', [VisitController::class, 'monthlyBreakdown']);

// Review Product
Route::post('reviews', [ReviewController::class, 'add']);
Route::get('product-reviews', [ReviewController::class, 'index']);

Route::middleware(['auth:sanctum', 'isApiAdmin'])->group(
    function(){

        Route::get('checking-authenticated', function() {
            return response()->json(['message' => 'You are authenticated'], 200);
        });

        // Instruments Category
        Route::post('add-category', [CategoryController::class, 'add']);
        Route::get('view-category', [CategoryController::class, 'index']);
        Route::get('edit-category/{id}', [CategoryController::class, 'edit']);
        Route::post('update-category/{id}', [CategoryController::class, 'update']);
        Route::delete('delete-category/{id}', [CategoryController::class, 'delete']);
        Route::get('all-category', [CategoryController::class, 'allCategory']);

        // Instruments Product
        Route::post('add-product', [ProductController::class, 'add']);
        Route::get('view-product', [ProductController::class, 'index']);
        Route::get('edit-product/{id}', [ProductController::class, 'edit']);
        Route::post('update-product/{id}', [ProductController::class, 'update']);
        Route::delete('delete-product/{id}', [ProductController::class, 'delete']);

        // Orders
        Route::get('view-order', [OrderController::class, 'index']);
        Route::get('edit-order/{id}', [OrderController::class, 'edit']);
        Route::put('update-order/{id}', [OrderController::class, 'update']);
        Route::get('viewOrderItems', [OrderController::class, 'indexByOrderItems']);
        
        // Notification
        Route::post('edit-notif-status/{orderId}', [NotificationController::class, 'edit']);
    }
);

Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

