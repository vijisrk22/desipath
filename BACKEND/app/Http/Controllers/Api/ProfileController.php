<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * @OA\Patch(
     *     path="/api/profile",
     *     summary="Update user profile",
     *     tags={"Profile"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="first_name", type="string", example="John"),
     *             @OA\Property(property="last_name", type="string", example="Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="newpassword123"),
     *             @OA\Property(property="phone_number", type="string", example="+1234567890"),
     *             @OA\Property(property="country_code", type="string", example="US")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Profile updated successfully"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        // Validate only the fields provided
        $rules = [
            'first_name' => 'sometimes|string|max:100',
            'last_name' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|min:6',
            'phone_number' => 'sometimes|string|max:20',
            'country_code' => 'sometimes|string|max:10',
        ];

        $validatedData = $request->validate($rules);

        // Handle name merging logic
        // Split existing full name
        $nameParts = explode(' ', $user->name, 2);
        $existingFirstName = $nameParts[0] ?? '';
        $existingLastName = $nameParts[1] ?? '';

        // Determine final first and last names
        $firstName = $validatedData['first_name'] ?? $existingFirstName;
        $lastName = $validatedData['last_name'] ?? $existingLastName;

        // Merge to full name
        $validatedData['name'] = trim($firstName . ' ' . $lastName);

        // if (isset($validatedData['first_name']) && !isset($validatedData['last_name'])) {
        //     // Only first_name given
        //     $validatedData['name'] = $validatedData['first_name'];
        // } elseif (!isset($validatedData['first_name']) && isset($validatedData['last_name'])) {
        //     // Only last_name given, update name with previous first_name + new last_name
        //     $validatedData['name'] = $user->first_name . ' ' . $validatedData['last_name'];
        // } elseif (isset($validatedData['first_name']) && isset($validatedData['last_name'])) {
        //     // Both names provided
        //     $validatedData['name'] = $validatedData['first_name'] . ' ' . $validatedData['last_name'];
        // }

        if (isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        $user->update($validatedData);

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => $user
        ]);
    }
}
