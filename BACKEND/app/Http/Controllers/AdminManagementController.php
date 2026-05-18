<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AdminManagementController extends Controller
{
    /**
     * Get users by role (e.g. admins)
     */
    public function index(Request $request)
    {
        if (Auth::user()->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized. Super Admin access required.'], 403);
        }

        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        } else {
            // Default to showing all administrative users
            $query->whereIn('role', ['admin', 'super_admin']);
        }

        return response()->json($query->get());
    }

    /**
     * Create a new user (admin or other)
     */
    public function store(Request $request)
    {
        if (Auth::user()->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized. Super Admin access required.'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:admin,super_admin,user,business'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => 'Active'
        ]);

        return response()->json($user, 201);
    }

    /**
     * Update an existing user
     */
    public function update(Request $request, $id)
    {
        if (Auth::user()->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized. Super Admin access required.'], 403);
        }

        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'required|string|in:admin,super_admin,user,business'
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json($user);
    }

    /**
     * Delete a user
     */
    public function destroy($id)
    {
        if (Auth::user()->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized. Super Admin access required.'], 403);
        }

        // Prevent self-deletion
        if (Auth::id() == $id) {
            return response()->json(['message' => 'You cannot delete yourself'], 400);
        }

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
