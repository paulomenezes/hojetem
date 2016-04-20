<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ads extends Model
{
    public $timestamps = false;
    
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'ads';

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
    protected $fillable = ['id', 'date', 'type', 'file', 'link', 'position', 'idstore'];
}
