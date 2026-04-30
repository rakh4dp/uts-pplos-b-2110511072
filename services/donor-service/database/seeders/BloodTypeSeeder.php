<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BloodType; 

class BloodTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = ['A', 'B', 'AB', 'O'];
        $rhesuses = ['+', '-'];

        foreach ($types as $type) {
            foreach ($rhesuses as $rhesus) {
                BloodType::firstOrCreate([
                    'type' => $type,
                    'rhesus' => $rhesus,
                ]);
            }
        }
    }
}