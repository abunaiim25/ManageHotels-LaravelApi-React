<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    //===================Register=======================
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|max:191',
            'email'    => 'required|email:191|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } else {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'phone'    => $request->phone,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken($user->email . '_Token')->plainTextToken;

            return response()->json([
                'status'   => 200,
                'username' => $user->name,
                'token'    => $token,
                'message'  => 'Registered Successfully',
            ]);
        }
    }

    //===================Login=======================
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email:191',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } else {
            $user = User::where('email', $request->email)->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status'  => 401,
                    'message' => 'Invalid Credentials',
                ]);
            } else {
                if ($user->role_as == 1) //1 = admin
                {
                    $role  = 'admin';
                    $token = $user->createToken($user->email . '_AdminToken', ['server:admin'])->plainTextToken;
                } else if ($user->role_as == 2) {
                    $role  = 'superadmin';
                    $token = $user->createToken($user->email . '_AdminToken', ['server:superadmin'])->plainTextToken;
                } else {
                    $role  = '';
                    $token = $user->createToken($user->email . '_Token', [''])->plainTextToken;
                }
                return response()->json([
                    'status'   => 200,
                    'username' => $user->name,
                    'token'    => $token,
                    'message'  => 'Logged In Successfully',
                    'role'     => $role,
                ]);
            }
        }
    }

    //===========User=============
    public function me(Request $request)
    {
        return $request->user();
    }

    //===================Logout=======================
    public function logout()
    {
        auth()->user()->tokens()->delete();
        return response()->json([
            'status'  => 200,
            'message' => 'Logged Out Successfully',
        ]);
    }

    public function googleLogin(Request $request)
    {
        $request->validate([
            'name'      => 'required',
            'email'     => 'required|email',
            'google_id' => 'required',
        ]);

        // Find existing user by email
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            // Create a new user if they don't exist
            $user = User::create([
                'name'      => $request->name,
                'email'     => $request->email,
                'google_id' => $request->google_id,
                'password'  => Hash::make(uniqid()), // Set a random password
            ]);
        } else {
            // Update Google ID if it's missing
            if (! $user->google_id) {
                $user->update(['google_id' => $request->google_id]);
            }
        }

        // Generate Sanctum token
        $token = $user->createToken($user->email . '_Token')->plainTextToken;

        return response()->json([
            'message' => 'User logged in successfully',
            'user'    => $user,
            'token'   => $token, // Send token to frontend
        ]);
    }

}
