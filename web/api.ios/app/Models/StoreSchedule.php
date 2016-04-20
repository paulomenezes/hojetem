<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreSchedule extends Model
{
    public $timestamps = false;
    
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'store_schedule';

    /**
     * The aditional attribute: getNameAttribute()
     *
     * @var arrray
     */
    protected $appends = array();

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['id', 'dayOfWeek', 'hourOpen', 'hourClose', 'closed', 'idStore'];
}
