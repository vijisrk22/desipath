<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuySellHome extends Model
{
    use HasFactory;

    protected $table = 'BuySellHomes';

    protected $fillable = [
        'user_type', 'home_type', 'price', 'built_area', 'lot_size', 'hoa_fees', 'year_built',
        'under_construction', 'bedroom_total', 'half_bathroom_total', 'full_bathroom_total',
        'basement_size', 'basement_status', 'laundry_in_house', 'home_level', 'pool',
        'annual_tax_amount', 'images', 'description', 'kitchen_granite_countertop',
        'fireplace_count', 'flooring', 'seller_id', 'location_state', 'location_city', 'location_zipcode', 'seller_name'
    ];

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
