<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Hash;

class AdsController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function index($type)
    {
        $notification = \App\Models\Shows::get();
        return response()->json($notification->toArray(), 200);
    }

    public function get($type, $id)
    {
        $notification = \App\Models\Shows::find($id);
        return response()->json($notification->toArray(), 200);
    }

    public function banners()
    {
        $notification = \App\Models\Ads::where('position', '=', 'carrousel')->get();
        return response()->json($notification->toArray(), 200);
    }
}
