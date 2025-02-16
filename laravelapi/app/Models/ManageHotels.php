<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManageHotels extends Model
{
    protected $table = 'manage_hotels';
    protected $fillable = [
        'property_name',
        'address',
        'cost_per_night',
        'number_of_available_rooms',
        'property_image',
        'Average_rating',
    ];
}
