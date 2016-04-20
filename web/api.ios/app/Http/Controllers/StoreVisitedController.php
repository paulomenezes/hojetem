<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Hash;

use \Input;

class StoreVisitedController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index($user, $type, $store)
    {
        $stores = \App\Models\StoreVisited::where("idVisitedType", '=', $type)->where('idStore', '=', $store)->count();
        $users = \App\Models\StoreVisited::where("idVisitedType", '=', $type)->where('idStore', '=', $store)->where('idAccount', '=', $user)->count();

        return response()->json([
            'visited' => $stores,
            'user' => $users
        ]);
    }

    public function shows($user, $type, $store)
    {
        $stores = \App\Models\StoreVisited::where("idVisitedType", '=', $type)->where('idShows', '=', $store)->count();
        $users = \App\Models\StoreVisited::where("idVisitedType", '=', $type)->where('idShows', '=', $store)->where('idAccount', '=', $user)->count();

        $accounts = \App\Models\StoreVisited::where("idVisitedType", '=', $type)
                                            ->where('idShows', '=', $store)
                                            ->join('account', 'account.id', '=', 'store_visited.idAccount')
                                            ->get(array('account.*'));

        return response()->json([
            'visited' => $stores,
            'user' => $users,
            'accounts' => $accounts
        ]);
    }

    public function checkin($checkin)
    {
        $iWill = \App\Models\StoreVisited::where("idVisitedType", '=', '6')
                                            ->where('idCheckin', '=', $checkin)
                                            ->join('account', 'account.id', '=', 'store_visited.idAccount')
                                            ->get(array('account.*'));
        $iWont = \App\Models\StoreVisited::where("idVisitedType", '=', '7')
                                            ->where('idCheckin', '=', $checkin)
                                            ->join('account', 'account.id', '=', 'store_visited.idAccount')
                                            ->get(array('account.*'));

        return response()->json([
            'will' => $iWont,
            'wont' => $iWont
        ]);
    }

    public function favorite($user)
    {
        $users = \App\Models\Store::join('store_visited', 'store_visited.idStore', '=', 'store.id')
                                  ->where('store_visited.idVisitedType', '=', '5')
                                  ->where('store_visited.idAccount', '=', $user)
                                  ->orderBy('store.name', 'asc')
                                  ->get(array('store.*'));

        return response()->json($users->toArray());
    }

    public function store(Request $request)
    {
        $idAccount = Input::json()->all()['idAccount'];
        $idVisitedType = Input::json()->all()['idVisitedType'];

        if (array_key_exists('idStore', Input::json()->all())) {
            $idStore = Input::json()->all()['idStore'];

            $visited = \App\Models\StoreVisited::where('idAccount', '=',  $idAccount)
                                               ->where('idStore', '=', $idStore)
                                               ->where('idVisitedType', '=', $idVisitedType)
                                               ->get();
            if (sizeof($visited) == 0) {
                $user = new \App\Models\StoreVisited();
                $user->idAccount = $idAccount;
                $user->idStore = $idStore;
                $user->idVisitedType = $idVisitedType;
                $user->save();

                return response()->json(['id' => $user->id]);
            } else {
                if ($idVisitedType == 5) {
                    $visited[0]->delete();
                    return response()->json(['removed' => 'removed']);
                } else {
                    return response()->json(['failed' => 'failed']);
                }
            }
        } else if (array_key_exists('idShows', Input::json()->all())) {
            $idShows = Input::json()->all()['idShows'];

            $visited = \App\Models\StoreVisited::where('idAccount', '=',  $idAccount)
                                               ->where('idShows', '=', $idShows)
                                               ->where('idVisitedType', '=', $idVisitedType)
                                               ->get();
            if (sizeof($visited) == 0) {
                $user = new \App\Models\StoreVisited();
                $user->idAccount = $idAccount;
                $user->idShows = $idShows;
                $user->idVisitedType = $idVisitedType;
                $user->save();

                return response()->json(['id' => $user->id]);
            } else {
                return response()->json(['failed' => 'failed']);
            }
        } else {
            $idCheckin = Input::json()->all()['idCheckin'];

            $visited = \App\Models\StoreVisited::where('idAccount', '=',  $idAccount)
                                               ->where('idCheckin', '=', $idCheckin)
                                               ->get();
            if (sizeof($visited) == 0) {
                $user = new \App\Models\StoreVisited();
                $user->idAccount = $idAccount;
                $user->idCheckin = $idCheckin;
                $user->idVisitedType = $idVisitedType;
                $user->save();

                return response()->json(['id' => $user->id]);
            } else {
                $visited[0]->idVisitedType = $idVisitedType;
                $visited[0]->save();

                return response()->json(['change' => 'ok']);
            }
        }
    }
}
