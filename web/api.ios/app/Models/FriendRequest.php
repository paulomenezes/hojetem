<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FriendRequest extends Model
{
    public $timestamps = false;
    
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'friend_request';

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
    protected $fillable = ['id', 'date', 'idAccount1', 'idAccount2'];
}
