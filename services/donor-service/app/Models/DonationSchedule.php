<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonationSchedule extends Model
{
    protected $fillable = ['donor_id', 'schedule_date', 'hospital_id', 'status'];

    public function donor()
    {
        return $this->belongsTo(Donor::class);
    }

    public function history()
    {
        return $this->hasOne(DonationHistory::class, 'schedule_id');
    }
}