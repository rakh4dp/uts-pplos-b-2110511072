<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donor;
use App\Http\Requests\StoreDonorRequest;
use Illuminate\Http\Request;

class DonorController extends Controller
{
    /**
     * daftar pendonor
     */
    public function index(Request $request)
    {
        $query = Donor::with('bloodType');

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->filled('blood_type_id')) {
            $query->where('blood_type_id', (int) $request->blood_type_id);
        }

        $perPage = min((int) $request->get('per_page', 10), 100);
        
        $donors = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => $donors
        ], 200); 
    }

    /**
     * Registrasi Pendonor 
     */
    public function store(StoreDonorRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user_id; 

        $donor = Donor::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Registrasi pendonor berhasil',
            'data'    => $donor->load('bloodType')
        ], 201);
    }

    public function show(Donor $donor)
    {
        return response()->json([
            'success' => true,
            'data'    => $donor->load('bloodType')
        ], 200);
    }

    /**
     * Update Data Pendonor
     */
    public function update(Request $request, Donor $donor)
    {
        if ($donor->user_id !== (int) $request->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden: Anda tidak memiliki akses ke data ini'
            ], 403); 
        }

        $validated = $request->validate([
            'name'          => 'sometimes|string|max:255',
            'phone'         => 'sometimes|string|max:15|unique:donors,phone,' . $donor->id,
            'address'       => 'sometimes|string',
            'blood_type_id' => 'sometimes|exists:blood_types,id',
        ]);

        $donor->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data pendonor berhasil diperbarui',
            'data'    => $donor->load('bloodType')
        ], 200);
    }

    /**
     * Hapus Data Pendonor
     */
    public function destroy(Request $request, Donor $donor)
    {
        if ($donor->user_id !== (int) $request->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden'
            ], 403);
        }

        $donor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data pendonor berhasil dihapus'
        ], 200);
    }
}