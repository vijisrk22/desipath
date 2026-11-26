<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\OTPMail;
use App\Mail\PasswordResetMail;
use App\Mail\PasswordChangedMail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;

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

        $user->update(['last_login_at' => now()]);

        // Backfill username for existing accounts that predate this feature
        if (empty($user->username)) {
            $nameParts = explode(' ', trim($user->name), 2);
            $user->update([
                'username' => User::generateUniqueUsername($nameParts[0] ?? '', $nameParts[1] ?? '')
            ]);
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
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:user,business',
            'business_name' => 'nullable|string|max:255',
            'business_phone' => 'nullable|string|max:20',
            'business_location' => 'nullable|string|max:255',
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

        // Parse first and last name for username generation
        $nameParts = explode(' ', trim($request->name), 2);
        $firstName = $nameParts[0] ?? '';
        $lastName   = $nameParts[1] ?? '';

        // Auto-generate unique username (e.g., viveksmith123)
        $username = User::generateUniqueUsername($firstName, $lastName);

        // Create user with Pending status
        $user = User::create([
            'name' => $request->name,
            'username' => $username,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
            'status' => 'Pending',
            'otp' => $otp,
            'otp_expires_at' => now()->addMinutes(15),
            'business_name' => $request->business_name,
            'business_phone' => $request->business_phone,
            'business_location' => $request->business_location,
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
            'last_login_at' => now(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Account activated successfully.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }


    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ], [
            'email.required' => 'Enter a valid email address.',
            'email.email' => 'Enter a valid email address.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Enter a valid email address.',
            ], 422);
        }

        $email = strtolower(trim($request->email));

        // Enforce rate limiting by IP
        $ipKey = 'pwd_req_ip:' . $request->ip();
        if (RateLimiter::tooManyAttempts($ipKey, 20)) {
            return response()->json([
                'message' => 'Too many attempts. Please wait and try again.',
            ], 429);
        }
        RateLimiter::hit($ipKey, 60);

        // Enforce 60-second cooldown per email
        $cooldownKey = 'pwd_cooldown:' . sha1($email);
        if (Cache::has($cooldownKey)) {
            $retryAfter = max(1, (int)Cache::get($cooldownKey . '_expires') - now()->timestamp);
            return response()->json([
                'message' => 'Too many attempts. Please wait and try again.',
                'retry_after' => $retryAfter,
            ], 429);
        }

        // Set 60-second resend cooldown for this email regardless of registration status
        Cache::put($cooldownKey, true, 60);
        Cache::put($cooldownKey . '_expires', now()->addSeconds(60)->timestamp, 60);

        $user = User::where('email', $email)->first();

        if ($user && $user->status !== 'Blocked') {
            // Cryptographically secure 6-digit code
            $code = sprintf('%06d', random_int(0, 999999));
            $digest = hash_hmac('sha256', $code, config('app.key'));

            // Invalidate previous code for that email
            $codeKey = 'pwd_code:' . sha1($email);
            Cache::forget($codeKey);

            // Store keyed digest, single-use, 10-minute expiration, 5 attempts max
            Cache::put($codeKey, [
                'user_id' => $user->id,
                'email' => $user->email,
                'digest' => $digest,
                'attempts' => 0,
                'expires_at' => now()->addMinutes(10)->timestamp,
            ], 600);

            // Dispatch email delivery
            try {
                Mail::to($user->email)->send(new PasswordResetMail($code));
            } catch (\Throwable $e) {
                \Log::error('Password reset email delivery failure: ' . $e->getMessage());
            }
        } else {
            // Equalize response timing for unregistered addresses to prevent timing attacks
            hash_hmac('sha256', '000000', config('app.key'));
            usleep(random_int(120000, 200000));
        }

        // Neutral confirmation response identical across registered and unregistered addresses
        return response()->json([
            'message' => "If a DesiPath account exists for that email address, we’ll send you a 6-digit reset code. Check your spam folder if it doesn’t arrive.",
        ], 200);
    }

    public function verifyResetCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'This code is invalid or has expired. Try again or request a new code.',
            ], 400);
        }

        $email = strtolower(trim($request->email));
        $codeKey = 'pwd_code:' . sha1($email);

        $record = Cache::get($codeKey);

        if (!$record) {
            return response()->json([
                'message' => 'This code is invalid or has expired. Try again or request a new code.',
            ], 400);
        }

        // Check attempt limit (5 attempts max)
        if (($record['attempts'] ?? 0) >= 5) {
            Cache::forget($codeKey);
            return response()->json([
                'message' => 'Too many attempts. Please wait and try again.',
            ], 429);
        }

        // Check expiration (10 minutes)
        if (now()->timestamp > ($record['expires_at'] ?? 0)) {
            Cache::forget($codeKey);
            return response()->json([
                'message' => 'This code is invalid or has expired. Try again or request a new code.',
            ], 400);
        }

        // Verify digest constant-time
        $expectedDigest = $record['digest'] ?? '';
        $providedDigest = hash_hmac('sha256', $request->code, config('app.key'));

        if (!hash_equals($expectedDigest, $providedDigest)) {
            $record['attempts'] = ($record['attempts'] ?? 0) + 1;
            if ($record['attempts'] >= 5) {
                Cache::forget($codeKey);
                return response()->json([
                    'message' => 'Too many attempts. Please wait and try again.',
                ], 429);
            }
            $remainingTtl = max(1, $record['expires_at'] - now()->timestamp);
            Cache::put($codeKey, $record, $remainingTtl);

            return response()->json([
                'message' => 'This code is invalid or has expired. Try again or request a new code.',
            ], 400);
        }

        // Code is valid: atomically consume it (single-use)
        Cache::forget($codeKey);

        // Issue short-lived authorization token scoped to setting a new password (15 minutes)
        $resetToken = bin2hex(random_bytes(32));
        Cache::put('pwd_auth:' . $resetToken, [
            'user_id' => $record['user_id'],
            'email' => $record['email'],
            'expires_at' => now()->addMinutes(15)->timestamp,
        ], 900);

        return response()->json([
            'message' => 'Code verified successfully.',
            'reset_token' => $resetToken,
        ], 200);
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reset_token' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'password.confirmed' => 'The passwords don’t match.',
            'password.min' => 'Password must be at least 6 characters.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $authKey = 'pwd_auth:' . $request->reset_token;
        $authData = Cache::get($authKey);

        if (!$authData || now()->timestamp > ($authData['expires_at'] ?? 0)) {
            return response()->json([
                'message' => 'Your reset session has expired. Request a new code.',
            ], 400);
        }

        // Invalidate authorization token immediately (single use)
        Cache::forget($authKey);

        $user = User::find($authData['user_id']);
        if (!$user) {
            return response()->json([
                'message' => 'Your reset session has expired. Request a new code.',
            ], 400);
        }

        // Update password, activate account & clear OTP
        $user->update([
            'password' => Hash::make($request->password),
            'status' => 'Active',
            'email_verified_at' => $user->email_verified_at ?? now(),
            'otp' => null,
            'otp_expires_at' => null,
        ]);

        // Invalidate outstanding sessions and tokens
        try {
            $user->tokens()->delete();
        } catch (\Throwable $e) {
            // Ignore if tokens table not populated
        }

        // Invalidate outstanding reset codes
        Cache::forget('pwd_code:' . sha1($user->email));

        // Send password change notification
        try {
            Mail::to($user->email)->send(new PasswordChangedMail());
        } catch (\Throwable $e) {
            \Log::error('Failed to send password changed notification: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Password updated successfully.',
        ], 200);
    }
}
