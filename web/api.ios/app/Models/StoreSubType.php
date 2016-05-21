<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreSubType extends Model
{
    public $timestamps = false;
    
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'store_sub_type';

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
    protected $fillable = ['name', 'Store_Type_Id'];
}