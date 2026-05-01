<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DonorController;
use App\Http\Controllers\Api\BloodTypeController;
use App\Http\Controllers\Api\DonationScheduleController;
use App\Http\Controllers\Api\DonationHistoryController;

Route::prefix('v1')->group(function () {
    // Publik
    Route::get('blood-types', [BloodTypeController::class, 'index']);
    Route::get('donors', [DonorController::class, 'index']);
    Route::get('donors/{donor}', [DonorController::class, 'show']);
    Route::get('schedules', [DonationScheduleController::class, 'indexAll']); // tambahan

    // Protected
    Route::middleware('check.user.id')->group(function () {
        Route::post('donors', [DonorController::class, 'store']);
        Route::put('donors/{donor}', [DonorController::class, 'update']);
        Route::patch('donors/{donor}', [DonorController::class, 'update']);
        Route::delete('donors/{donor}', [DonorController::class, 'destroy']);
        Route::apiResource('donors.schedules', DonationScheduleController::class);
        Route::apiResource('donors.histories', DonationHistoryController::class);
    });
});