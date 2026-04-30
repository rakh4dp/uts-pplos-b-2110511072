<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BloodType extends Model
{
    protected $fillable = ['type', 'rhesus'];

    public function donors()
    {
        return $this->hasMany(Donor::class);
    }
}