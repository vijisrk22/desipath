<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Google\Client as GoogleClient;

class GoogleAuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/auth/google/",
     *     summary="Login with Google token",
     *     description="Authenticate user using Google ID token and return API token",
     *     operationId="googleLogin",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"token"},
     *             @OA\Property(property="token", type="string", description="Google ID token from frontend")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful login returns user data and token",
     *         @OA\JsonContent(
     *             @OA\Property(property="token", type="string", description="API authentication token"),
     *             @OA\Property(
     *                 property="user",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="email", type="string"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time"),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid Google token",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Invalid Google token")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     *
     */
    public function login(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $client = new GoogleClient(['client_id' => config('services.google.client_id')]); // Same client ID as frontend
        
        try {
            $payload = $client->verifyIdToken($request->token);
        } catch (\Exception $e) {
            \Log::error('Google token verification failed: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid Google token structure'], 401);
        }

        if ($payload) {
            $email = $payload['email'];
            $name = $payload['name'];

            // Find or create user
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name, 
                    'password' => Hash::make(uniqid()),
                    'role' => 'user', // Default role for Google sign-ups
                    'status' => 'Active',
                ]
            );

            $token = $user->createToken('google-token')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'user' => $user,
            ]);
        } else {
            return response()->json(['error' => 'Invalid Google token'], 401);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/auth/google/googlecheck",
     *     summary="Dummy API for redirect check",
     *     description="Returns a dummy message",
     *     operationId="googleCheck",
     *     tags={"Authentication"},
     *     @OA\Response(
     *         response=200,
     *         description="Dummy response",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="dummy api redirect")
     *         )
     *     )
     * )
     */
    public function googlecheck(Request $request)
    {
        return response()->json([
            'message' => 'dummy api redirect',
        ]);
    }
}
