<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Category;
use App\Models\Product;
use File;
use Illuminate\Http\Request;
use Validator;

class CategoryController extends Controller
{
    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'meta_title'=>'required|max:191',
            'slug'=>'required|max:191',
            'name'=>'required|max:191',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors'=>$validator->messages(),
            ], 400);
        } else {
            $category = new Category;
            $category->meta_title = $request->input('meta_title');
            $category->meta_keywords = $request->input('meta_keywords');
            $category->meta_description = $request->input('meta_description');
            $category->slug = $request->input('slug');
            $category->name = $request->input('name');
            $category->description = $request->input('description');
            $category->status = $request->input('status') == true ? '1' : '0';
            $category->save();
            return response()->json([
                'message'=>'Category Added Successfully',
            ], 200);
        }
    }

    public function index()
    {
        $category = Category::all();
        return response()->json([
            'category' => $category,
        ], 200);
    }

    public function edit($id)
    {
         $category = Category::find($id);
        if ($category) {
            return response()->json([
                'category'=>$category,
            ], 200);
        } else {
            return response()->json([
                'message'=>'No Category Id Found',
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'meta_title'=>'required|max:191',
            'slug'=>'required|max:191',
            'name'=>'required|max:191',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors'=>$validator->messages(),
            ], 400);
        } else {
            $category = Category::find($id);

            if ($category) {
                $category->meta_title = $request->input('meta_title');
                $category->meta_keywords = $request->input('meta_keywords');
                $category->meta_description = $request->input('meta_description');
                $category->slug = $request->input('slug');
                $category->name = $request->input('name');
                $category->description = $request->input('description');
                $category->status = $request->input('status') == true ? '1' : '0';
                $category->save();
                return response()->json([
                    'message'=>'Category Updated Successfully',
                ], 200);
            } else {
                return response()->json([
                    'message'=>'No Category ID Found',
                ], 404);
            }
        }
    }
    public function delete($id)
    {
        // Find the category by ID
        $category = Category::find($id);
        
        // Find all products related to this category
        $products = Product::where('category_id', $id)->get();
        
        if ($category) {
            // Iterate over each product
            foreach ($products as $product) {
                
                // Check if the product has images
                if ($product->images) {
                    $existingImages = json_decode($product->images, true);

                    // Delete the images from storage
                    foreach ($existingImages as $image) {
                        $path = $image;
                        if (File::exists($path)) {
                            File::delete($path);
                        }
                    }
                }

                // Delete the product from any carts
                Cart::where('product_id', $product->id)->delete();

                // Delete the product itself
                $product->delete();
            }

            // Delete the category after all associated products are deleted
            $category->delete();

            return response()->json([
                'message' => 'Category and its products deleted successfully',
            ], 200);
        } else {
            return response()->json([
                'message' => 'No Category ID Found',
            ], 404);
        }
    }

    
    public function allCategory()
    {
        $category = Category::where('status', '0')->get();
        return response()->json([
            'category'=>$category,
        ], 200);
    }
}
