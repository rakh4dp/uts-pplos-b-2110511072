<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonationHistory extends Model
{
    protected $fillable = ['donor_id', 'schedule_id', 'donation_date', 'quantity_ml', 'notes'];

    public function donor()
    {
        return $this->belongsTo(Donor::class);
    }

    public function schedule()
    {
        return $this->belongsTo(DonationSchedule::class);
    }
}