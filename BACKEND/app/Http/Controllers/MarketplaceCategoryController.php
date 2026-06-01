<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MarketplaceCategoryController extends Controller
{
    /**
     * Get categories for a specific module (Public)
     */
    public function index(Request $request)
    {
        $module = $request->query('module');
        
        $query = DB::table('marketplace_categories');
        if ($module) {
            $query->where('module', $module);
        }
        
        $categories = $query->get();
        
        foreach ($categories as $cat) {
            $cat->subcategories = DB::table('marketplace_subcategories')
                ->where('category_id', $cat->id)
                ->get();
        }
        
        return response()->json(['success' => true, 'data' => $categories]);
    }

    /**
     * Admin: Store Category
     */
    public function store(Request $request)
    {
        $request->validate([
            'module' => 'required|string',
            'name' => 'required|string',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
            'accent' => 'nullable|string'
        ]);

        $id = DB::table('marketplace_categories')->insertGetId([
            'module' => $request->module,
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'icon' => $request->icon,
            'color' => $request->color,
            'accent' => $request->accent,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true, 'id' => $id]);
    }

    /**
     * Admin: Update Category
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
            'accent' => 'nullable|string'
        ]);

        DB::table('marketplace_categories')->where('id', $id)->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'icon' => $request->icon,
            'color' => $request->color,
            'accent' => $request->accent,
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Admin: Delete Category
     */
    public function destroy($id)
    {
        DB::table('marketplace_categories')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    /**
     * Admin: Store Subcategory
     */
    public function storeSubcategory(Request $request, $categoryId)
    {
        $request->validate([
            'name' => 'required|string',
            'icon' => 'nullable|string'
        ]);

        $id = DB::table('marketplace_subcategories')->insertGetId([
            'category_id' => $categoryId,
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'icon' => $request->icon,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true, 'id' => $id]);
    }

    /**
     * Admin: Update Subcategory
     */
    public function updateSubcategory(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'icon' => 'nullable|string'
        ]);

        DB::table('marketplace_subcategories')->where('id', $id)->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'icon' => $request->icon,
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Admin: Delete Subcategory
     */
    public function destroySubcategory($id)
    {
        DB::table('marketplace_subcategories')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }
}
