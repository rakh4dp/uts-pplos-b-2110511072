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
    Schema::create('donation_history', function (Blueprint $table) {
        $table->id();
        $table->foreignId('donor_id')->constrained('donors')->onDelete('cascade');
        $table->date('donation_date');
        $table->integer('quantity_ml'); 
        $table->text('notes')->nullable();
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donation_history');
    }
};
