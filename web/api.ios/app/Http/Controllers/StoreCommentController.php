<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Hash;

use \Input;

class StoreCommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index($store)
    {
        $stores = \App\Models\StoreComment::where('idStore', '=', $store)
                                          ->orderBy('id', 'desc')
                                          ->join('account', 'account.id', '=', 'store_comment.idAccount')
                                          ->get(array('store_comment.*', 'account.name', 'account.lastname', 'account.phone', 'account.image', 'account.cover', 'account.facebookID'));

        return response()->json($stores);
    }

    public function shows($store)
    {
        $stores = \App\Models\StoreComment::where('idShows', '=', $store)
                                          ->orderBy('id', 'desc')
                                          ->join('account', 'account.id', '=', 'store_comment.idAccount')
                                          ->get(array('store_comment.*', 'account.name', 'account.lastname', 'account.phone', 'account.image', 'account.cover', 'account.facebookID'));

        return response()->json($stores);
    }

    public function checkin($checkin)
    {
        $stores = \App\Models\StoreComment::where('idCheckin', '=', $checkin)
                                          ->orderBy('id', 'desc')
                                          ->join('account', 'account.id', '=', 'store_comment.idAccount')
                                          ->get(array('store_comment.*', 'account.name', 'account.lastname', 'account.phone', 'account.image', 'account.cover', 'account.facebookID'));

        return response()->json($stores);
    }

    public function store(Request $request)
    {
        $idAccount = Input::json()->all()['idAccount'];
        if (array_key_exists('idStore', Input::json()->all())) {
          $idStore = Input::json()->all()['idStore'];
        } else if (array_key_exists('idShows', Input::json()->all())) {
          $idShows = Input::json()->all()['idShows'];
          $idStore = null;
        } else {
          $idStore = null;
          $idShows = null;
          $idCheckin = Input::json()->all()['idCheckin'];
        }
        $message = Input::json()->all()['message'];

        $user = new \App\Models\StoreComment();
        $user->idAccount = $idAccount;
        if ($idStore) {
          $user->idStore = $idStore;
        } else if ($idShows) {
          $user->idShows = $idShows;
        } else {
          $user->idCheckin = $idCheckin;
        }
        $user->message = $message;
        $user->save();

        return response()->json(["id" => $user->id]);
    }
}
