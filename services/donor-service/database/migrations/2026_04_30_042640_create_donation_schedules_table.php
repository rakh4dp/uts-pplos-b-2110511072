<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    Schema::create('donation_schedules', function (Blueprint $table) {
        $table->id();
        $table->foreignId('donor_id')->constrained('donors')->onDelete('cascade');
        $table->date('schedule_date');
        $table->unsignedBigInteger('hospital_id');
        $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donation_schedules');
    }
};
