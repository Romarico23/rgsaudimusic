<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use Illuminate\Http\Request;

class VisitController extends Controller
{
    public function store()
    {
        Visit::create(); // Automatically sets the created_at timestamp
        return response()->json(['message' => 'Visit recorded.'], 201);
    }

    public function totalVisits()
    {
        $totalCount = Visit::count();
        return response()->json(['total_visits' => $totalCount], 200);
    }

    public function monthlyBreakdown()
    {
        $visits = Visit::selectRaw('DATE_FORMAT(created_at, "%b %Y") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->get();
            
        return response()->json(['total_visits' => $visits], 200);
    }
    
}
