<?php

namespace App\Http\Controllers;

use App\Models\Airport;
use Illuminate\Http\Request;

class AirportController extends Controller
{
    /**
     * Search for airports by IATA code, city, or name.
     */
    public function search(Request $request)
    {
        $query = $request->query('q');

        if (!$query || strlen($query) < 2) {
            return response()->json([]);
        }

        $airports = Airport::where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('iata_code', 'like', strtoupper($query) . '%')
                  ->orWhere('city', 'like', $query . '%')
                  ->orWhere('airport_name', 'like', '%' . $query . '%');
            })
            ->orderBy('is_popular', 'desc')
            ->orderBy('iata_code', 'asc')
            ->limit(8)
            ->get();

        return response()->json($airports);
    }
}
