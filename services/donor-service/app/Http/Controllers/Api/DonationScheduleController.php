<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donor;
use App\Models\DonationSchedule;
use Illuminate\Http\Request;

class DonationScheduleController extends Controller
{
    public function index(Request $request, Donor $donor)
    {
        if ($donor->user_id !== (int) $request->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $query = $donor->schedules();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        $perPage = min((int) $request->get('per_page', 10), 100);
        $schedules = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data'    => $schedules
        ], 200);
    }

    /**
     * Membuat jadwal baru jika tidak ada jadwal pending
     */
    public function store(Request $request, Donor $donor)
    {
        if ($donor->user_id !== (int) $request->user_id) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $pendingExists = $donor->schedules()->where('status', 'pending')->exists();
        if ($pendingExists) {
            return response()->json([
                'success' => false,
                'message' => 'Anda masih memiliki jadwal yang belum selesai'
            ], 409); 
        }

        $validated = $request->validate([
            'schedule_date' => 'required|date|after:today',
            'location'       => 'required|string',
        ]);

        $schedule = $donor->schedules()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Jadwal berhasil dibuat',
            'data'    => $schedule
        ], 201);
    }

    public function show(Request $request, Donor $donor, DonationSchedule $schedule)
    {
        if ($donor->user_id !== (int) $request->user_id || $schedule->donor_id !== $donor->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json([
            'success' => true,
            'data'    => $schedule
        ]);
    }

    /**
     * Mengubah data jadwal (jika status masih pending)
     */
    public function update(Request $request, Donor $donor, DonationSchedule $schedule)
    {
        if ($donor->user_id !== (int) $request->user_id || $schedule->donor_id !== $donor->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($schedule->status !== 'pending') {
            return response()->json(['message' => 'Jadwal yang sudah selesai tidak bisa diubah'], 422);
        }

        $validated = $request->validate([
            'schedule_date' => 'sometimes|required|date|after:today',
            'location'       => 'sometimes|required|string',
        ]);

        $schedule->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Jadwal berhasil diperbarui',
            'data'    => $schedule
        ]);
    }

    /**
     * Menghapus/Membatalkan jadwal
     */
    public function destroy(Request $request, Donor $donor, DonationSchedule $schedule)
    {
        if ($donor->user_id !== (int) $request->user_id || $schedule->donor_id !== $donor->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $schedule->delete();

        return response()->json([
            'success' => true,
            'message' => 'Jadwal berhasil dihapus'
        ], 200);
    }
}