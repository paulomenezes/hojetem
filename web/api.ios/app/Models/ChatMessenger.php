<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessenger extends Model
{
    public $timestamps = false;
    
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'chat_messenger';

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
    protected $fillable = ['id', 'date', 'text', 'iduser', 'idchat', 'platform'];
}
