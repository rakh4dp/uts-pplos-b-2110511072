<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donor;
use App\Models\DonationHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DonationHistoryController extends Controller
{
    public function index(Request $request, Donor $donor)
    {
        if ($donor->user_id !== (int) $request->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        
        $query = $donor->histories()->with('schedule');
        
        if ($request->filled('date')) {
            $query->whereDate('donation_date', $request->date);
        }
        
        $perPage = min((int) $request->get('per_page', 10), 100);
        $histories = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data'    => $histories
        ], 200);
    }

    public function store(Request $request, Donor $donor)
    {
        if ($donor->user_id !== (int) $request->user_id) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'schedule_id'   => 'nullable|exists:donation_schedules,id',
            'donation_date' => 'required|date|before_or_equal:today',
            'quantity_ml'   => 'required|integer|min:100',
            'notes'         => 'nullable|string'
        ]);

        if (!empty($validated['schedule_id'])) {
            $scheduleOwned = $donor->schedules()->where('id', $validated['schedule_id'])->exists();
            if (!$scheduleOwned) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jadwal tidak ditemukan atau bukan milik Anda'
                ], 404);
            }
        }

        $history = $donor->histories()->create($validated);

        if ($request->filled('schedule_id')) {
            $donor->schedules()->where('id', $request->schedule_id)->update(['status' => 'completed']);
        }

        try {
            $service3Url = env('SERVICE_REQUEST_URL', 'http://localhost:3003/api/v1');

            Http::post($service3Url . '/stocks/sync', [
                'blood_type_id' => $donor->blood_type_id,
                'quantity_ml'   => $validated['quantity_ml']
            ]);
        } catch (\Exception $e) {
            
        }

        return response()->json([
            'success' => true,
            'message' => 'Riwayat donor berhasil dicatat dan stok disinkronkan',
            'data'    => $history->load('schedule')
        ], 201);
    }

    public function show(Request $request, Donor $donor, DonationHistory $history)
    {
        if ($donor->user_id !== (int) $request->user_id || $history->donor_id !== $donor->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json([
            'success' => true,
            'data'    => $history->load('schedule')
        ]);
    }

    public function update(Request $request, Donor $donor, DonationHistory $history)
    {
        if ($donor->user_id !== (int) $request->user_id || $history->donor_id !== $donor->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'donation_date' => 'sometimes|required|date|before_or_equal:today',
            'quantity_ml'   => 'sometimes|required|integer|min:100',
            'notes'         => 'nullable|string'
        ]);

        $history->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Riwayat donor berhasil diperbarui',
            'data'    => $history->load('schedule')
        ]);
    }

    public function destroy(Request $request, Donor $donor, DonationHistory $history)
    {
        if ($donor->user_id !== (int) $request->user_id || $history->donor_id !== $donor->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $history->delete();

        return response()->json([
            'success' => true,
            'message' => 'Riwayat donor berhasil dihapus'
        ], 200);
    }
}