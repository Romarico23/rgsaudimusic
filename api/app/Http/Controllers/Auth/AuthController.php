<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Auth;
use Hash;
use Illuminate\Http\Request;
use Validator;

class AuthController extends Controller
{
    public function index()
    {
        if (auth('sanctum')->check()) {
            $user_id = auth('sanctum')->user()->id;
            $user = User::where('id', $user_id)->get();
 
            return response()->json([
                'user' => $user,
            ], 200);


        } else {
            return response()->json([
                'message' => 'Login to View Cart Data',
            ], 401);
        }
 
    }
    public function register(Request $request)
    {
        
        $validator = Validator::make($request->all(),[
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
            'password_confirmation' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048'
            ], [
                'image.required' => 'The image field is required. ',
                'image.image' => 'The image field must be an image. ',
            ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_error' => $validator->messages()
            ], 401);
        } else {

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/auth/'), $imageName);
                $imagePath = 'uploads/auth/' . $imageName;
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'image' => $imagePath,
            ]);

            $token = $user->createToken($user->email.'_Token')->plainTextToken;

            return response()->json([
                'name' => $user->name,
                'token' => $token,
                'message' => 'Registered Successfully',
            ], 201);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'=>'required|email|exists:users|max:191',
            'password'=>'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_error'=>$validator->messages()
            ], 401);
        } else {
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'message' => 'Invalid credentials!'
                ], 403);
            } else {
                    if ($user->role_as == 1) {
                        $role = 'admin';
                        $token = $user->createToken($user->email.'_AdminToken', ['server:admin'])->plainTextToken;
                    } else {
                        $role = '';
                        $token = $user->createToken($user->email.'_Token', [''])->plainTextToken;
                    }

                return response()->json([
                    'name'=>$user->name,
                    'token'=>$token,
                    'message'=>'Logged In Successfully',
                    'role'=>$role,
                    ], 200);
                }
        }
    }

    public function logout(Request $request)
    {
        // $request->user()->tokens()->delete();
        auth()->user()->tokens()->delete();

        return response()->json([
            'message'=>'Logged Out Successfully',
        ], 200);

    }

}
