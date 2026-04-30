<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donor extends Model
{
    protected $fillable = ['user_id', 'blood_type_id', 'name', 'phone', 'address'];

    public function bloodType()
    {
        return $this->belongsTo(BloodType::class);
    }

    public function schedules()
    {
        return $this->hasMany(DonationSchedule::class);
    }

    public function histories()
    {
        return $this->hasMany(DonationHistory::class);
    }
}