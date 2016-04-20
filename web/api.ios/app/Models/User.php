<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    public $timestamps = false;
    
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'account';

    /**
     * The aditional attribute: getNameAttribute()
     *
     * @var arrray
     */
    protected $appends = array('full_name');

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'lastname', 'email', 'password', 'phone', 'gender', 'ocupation', 'user', 'birth', 'facebook', 'facebookID', 'image', 'cover'];

    public function getFullNameAttribute()
    {
        return $this->name . ' ' . $this->lastname;
    }
}
