<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Hash;

class StoreSubTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $users = \App\Models\StoreSubType::orderBy('Store_Type_id', 'asc')->orderBy('name', 'asc')->get();

        return response()->json($users->toArray());
    }

    public function get($id)
    {
        $users = \App\Models\StoreSubType::where('store_sub_type.Store_Type_id', '=', $id)
                                            ->join('store_type', 'store_type.id', '=', 'store_sub_type.Store_Type_id')
                                            ->orderBy('store_sub_type.name', 'asc')
                                            ->get(array('store_sub_type.*', 'store_type.name as TypeName'));
        
        return response()->json($users->toArray());
    }

    public function getName($type, $sub)
    {
        $type = \App\Models\StoreType::find($type);
        $sub = \App\Models\StoreSubType::find($sub);

        return response()->json([
             'type' => $type->toArray(),
             'sub' => $sub->toArray()
        ]);
    }
}
