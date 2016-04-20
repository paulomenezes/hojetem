<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreComment extends Model
{
    public $timestamps = false;
    
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'store_comment';

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
    protected $fillable = ['id', 'idStore', 'idShows', 'idCheckin', 'idAccount', 'date', 'message', 'facebookID', 'name', 'lastname', 'image'];
}
