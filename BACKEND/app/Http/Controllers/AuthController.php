<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\OTPMail;

class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/login",
     *     summary="Login user and get authentication token",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123")
     *         ),
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful login",
     *         @OA\JsonContent(
     *             @OA\Property(property="access_token", type="string"),
     *             @OA\Property(property="token_type", type="string", example="Bearer"),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid password"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found"
     *     ),
     * )
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid password.'
            ], 401);
        }

        if ($user->status === 'Pending') {
            return response()->json([
                'message' => 'Account is pending. Please verify your email with OTP.',
                'status' => 'pending',
                'email' => $user->email
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/register",
     *     summary="Register a new user",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email", "password", "role"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="johndoe@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123"),
     *             @OA\Property(property="role", type="string", example="user", enum={"user", "business"})
     *         ),
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User registered successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="email", type="string")
     *         )
     *     ),
     *     @OA\Response(
    *         response=422,
    *         description="Validation error",
    *         @OA\JsonContent(
    *             @OA\Property(property="errors", type="object",
    *                 @OA\Property(property="email", type="array", @OA\Items(type="string", example="The email must be a valid email address.")),
    *                 @OA\Property(property="password", type="array", @OA\Items(type="string", example="The password must be at least 6 characters."))
    *             )
    *         )
    *     ),
    *     @OA\Response(
    *         response=409,
    *         description="Email already registered",
    *         @OA\JsonContent(
    *             @OA\Property(property="message", type="string", example="Email is already registered.")
    *         )
    *     )
     * )
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:user,business',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'message' => 'Email is already registered.'
            ], 409);
        }

        // Generate 6 digit OTP
        $otp = rand(100000, 999999);
        
        // Create user with Pending status
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
            'status' => 'Pending',
            'otp' => $otp,
            'otp_expires_at' => now()->addMinutes(15),
        ]);

        // MOCK EMAIL SENDING: Log the OTP to laravel.log
        \Log::info("OTP for {$user->email}: {$otp}");

        // REAL EMAIL SENDING:
        try {
            Mail::to($user->email)->send(new OTPMail($otp));
        } catch (\Exception $e) {
            \Log::error("Failed to send OTP email: " . $e->getMessage());
        }

        return response()->json([
            'message' => 'Registration successful. Please verify the OTP sent to your email.',
            'email' => $user->email,
            'status' => 'pending'
        ], 201);
    }

    /**
     * @OA\Post(
     *     path="/api/verify-otp",
     *     summary="Verify OTP and activate account",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "otp"},
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="otp", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Account activated successfully")
     * )
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)
                    ->where('otp', $request->otp)
                    ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid OTP or email.'], 400);
        }

        if ($user->otp_expires_at < now()) {
            return response()->json(['message' => 'OTP has expired.'], 400);
        }

        // Activate user
        $user->update([
            'status' => 'Active',
            'otp' => null,
            'otp_expires_at' => null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Account activated successfully.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }
}
