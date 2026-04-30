<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BloodType;
use Illuminate\Http\Request;

class BloodTypeController extends Controller
{
    public function index()
    {
        $bloodTypes = BloodType::all();
        return response()->json([
            'success' => true,
            'data'    => $bloodTypes
        ], 200); 
    }
}