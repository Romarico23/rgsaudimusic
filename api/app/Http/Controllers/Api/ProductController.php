<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Validator;
use File;

class ProductController extends Controller
{
    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|max:191',
            'slug' => 'required|max:191',
            'name' => 'required|max:191',
            'meta_title' => 'required|max:191',
            'brand' => 'required|max:20',
            'selling_price' => 'required|max:20',
            'original_price' => 'required|max:20',
            'meta_description' => 'max:191',
            'description' => 'required|max:1001',
            'quantity' => 'required|max:4',
            'images' => 'required',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->messages(),
            ], 422);
        } else {
            $product = new Product;
    
            $product->category_id = $request->input('category_id');
            $product->slug = $request->input('slug');
            $product->name = $request->input('name');
            $product->description = $request->input('description');
    
            $product->meta_title = $request->input('meta_title');
            $product->meta_keywords = $request->input('meta_keywords');
            $product->meta_description = $request->input('meta_description');
    
            $product->brand = $request->input('brand');
            $product->selling_price = $request->input('selling_price');
            $product->original_price = $request->input('original_price');
            $product->quantity = $request->input('quantity');

            if ($request->hasFile('images')) {
                $newImages = [];
                foreach ($request->file('images') as $key => $file) {
                    $extension = $file->getClientOriginalExtension();
                    $filename = time() . '-' . $key . '.' . $extension;
                    $file->move('uploads/product/', $filename);
                    $newImages[] = 'uploads/product/' . $filename;
                }
                $product->images = json_encode($newImages);
            }

            $product->featured = filter_var($request->input('featured'), FILTER_VALIDATE_BOOLEAN);
            $product->popular = filter_var($request->input('popular'), FILTER_VALIDATE_BOOLEAN);
            $product->status = filter_var($request->input('status'), FILTER_VALIDATE_BOOLEAN);
            $product->save();
    
            return response()->json([
                'message' => 'Product Added Successfully',
            ], 200);
        }
    }
    
    public function index()
    {
        $products = Product::all();

        return response()->json([
            'products'=>$products,
        ], 200);
    }

    public function edit($id)
    {
         $product = Product::find($id);
        if ($product) {
            return response()->json([
                'product'=>$product,
            ], 200);
        } else {
            return response()->json([
                'message'=>'No Product Found',
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(),[
            'category_id'=>'required|max:191',
            'slug'=>'required|max:191',
            'name'=>'required|max:191',
            'meta_title'=>'required|max:191',
            'brand'=>'required|max:20',
            'selling_price'=>'required|max:20',
            'original_price'=>'required|max:20',
            'meta_description' => 'max:191',
            'description' => 'required|max:1001',
            'quantity'=>'required|max:4',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:5048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors'=>$validator->messages(),
            ], 422);
        } else {
            $product = Product::findOrFail($id);

            if ($product) {
                $product->category_id = $request->input('category_id');
                $product->slug = $request->input('slug');
                $product->name = $request->input('name');
                $product->description = $request->input('description');
    
                $product->meta_title = $request->input('meta_title');
                $product->meta_keywords = $request->input('meta_keywords');
                $product->meta_description = $request->input('meta_description');
    
                $product->brand = $request->input('brand');
                $product->selling_price = $request->input('selling_price');
                $product->original_price = $request->input('original_price');
                $product->quantity = $request->input('quantity');

                if ($request->hasFile('images')) {
                    if ($product->images) {
                        $existingImages = json_decode($product->images, true);
                        foreach ($existingImages as $image) {
                            $path = $image;
                            if (File::exists($path)) {
                                File::delete($path);
                            }
                        }
                    }
                
                    $newImages = [];
                    foreach ($request->file('images') as $key => $file) {
                        $extension = $file->getClientOriginalExtension();
                        $filename = time() . '-' . $key . '.' . $extension;
                        $file->move('uploads/product/', $filename);
                        $newImages[] = 'uploads/product/' . $filename;
                    }
                    $product->images = json_encode($newImages);
                }
                
                $product->featured = filter_var($request->input('featured'), FILTER_VALIDATE_BOOLEAN);
                $product->popular = filter_var($request->input('popular'), FILTER_VALIDATE_BOOLEAN);
                $product->status = filter_var($request->input('status'), FILTER_VALIDATE_BOOLEAN);
                $product->update();
    
                return response()->json([
                    'message'=>'Product Updated Successfully',
                ], 200);

            } else {
                return response()->json([
                    'message'=>'Product Not Found',
                ], 404);
            }
        }
    }

    public function delete($id)
    {
        $product = Product::findOrFail($id);
        $cart = Cart::where('product_id', $id);
        
        if ($product) {
            if ($product->images) {
                $existingImages = json_decode($product->images, true);

                foreach ($existingImages as $image) {
                    $path = $image;
                    if (File::exists($path)) {
                        File::delete($path);
                    }
                }
            }

            $product->delete();
            $cart->delete();
            return response()->json([
                'message'=>'Product Deleted Successfully',
            ], 200);
        } else {
            return response()->json([
                'message'=>'No Product ID Found',
            ], 404);
        }
    }
}


