<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    public $timestamps = false;
    
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'store';

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
    protected $fillable = ['id', 'idStoreType', 'date', 'showOnApp', 'hasMenu', 'name', 'responsible', 'user', 'email', 'password', 'phone1', 'phone2', 'phone3', 'address', 'bairro', 'cidade', 'estado', 'cep', 'cnpj', 'site', 'twitter', 'facebook', 'instagram', 'hour', 'image', 'icon', 'image1', 'image2', 'image3', 'vip', 'lat', 'description', 'longitude', 'city', 'subtype'];
}
