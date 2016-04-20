<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Hash;

class NotificationController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        $notification = new \App\Models\Notification();
        $notification->message = $requestmessagename;
        $notification->read = $request->read;
        if ($request->idStore) {
            $notification->idStore = $request->idStore;
        } else {
            $notification->idShows = $request->idShows;
        }
        $notification->idusersend = $request->idusersend;
        $notification->iduserreceiver = $request->iduserreceiver;
        $notification->save();

        return response()->json([
                "msg" => "Success",
                "id" => $notification->id
            ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $notification = \App\Models\Notification::where('iduserreceiver', $id)
                                                ->join('store', 'store.id', '=', 'store_notification.idStore')
                                                ->join('account', 'account.id', '=', 'store_notification.idusersend')
                                                ->orderBy('id', 'desc')
                                                ->get(array('store_notification.*', 'store.name as storeName', 'store.icon', 'store.id as storeId', 'account.name', 'account.lastname'));

        $notification2 = \App\Models\Notification::where('iduserreceiver', $id)
                                                ->join('shows', 'shows.id', '=', 'store_notification.idShows')
                                                ->join('account', 'account.id', '=', 'store_notification.idusersend')
                                                ->orderBy('id', 'desc')
                                                ->get(array('store_notification.*', 'shows.name as storeName', 'shows.icon', 'shows.id as storeId', 'account.name', 'account.lastname'));

        $notification3 = \App\Models\Notification::where('iduserreceiver', $id)
                                                ->where('idShows', '=', null)
                                                ->where('idStore', '=', null)
                                                ->join('account', 'account.id', '=', 'store_notification.idusersend')
                                                ->orderBy('id', 'desc')
                                                ->get(array('store_notification.*', 'account.name', 'account.lastname'));

        $friends = \App\Models\FriendRequest::where('idAccount2', '=', $id)
                                     ->join('account', 'account.id', '=', 'friend_request.idAccount1')
                                     ->get(array('account.*', 'friend_request.id as IDRequest', 'friend_request.idAccount1', 'friend_request.idAccount2'));
                                                                                    
        return response()->json([
                "notifications" => array_merge($notification3->toArray(), array_merge($notification->toArray(), $notification2->toArray())),
                "requests" => $friends
            ]);
    }

    public function showRead($id)
    {
        $notification3 = \App\Models\Notification::where('iduserreceiver', $id)
                                                ->where('idStore', '=', null)
                                                ->where('idShows', '=', null)
                                                ->where('read', '=', 0)
                                                ->join('account', 'account.id', '=', 'store_notification.idusersend')
                                                ->orderBy('id', 'desc')
                                                ->get(array('store_notification.message', 'account.*'));

        $updated = \App\Models\Notification::where('iduserreceiver', $id)->get();
        for ($i=0; $i < sizeof($updated); $i++) { 
            $updated[$i]->read = 1;
            $updated[$i]->save();
        }

        $notification = \App\Models\Notification::where('iduserreceiver', $id)
                                                ->join('store', 'store.id', '=', 'store_notification.idStore')
                                                ->join('account', 'account.id', '=', 'store_notification.idusersend')
                                                ->orderBy('id', 'desc')
                                                ->get(array('store_notification.*', 'store.name as storeName', 'store.icon', 'store.id as storeId', 'account.name', 'account.lastname', 'store.image as StoreCover'));

        $notification2 = \App\Models\Notification::where('iduserreceiver', $id)
                                                ->join('shows', 'shows.id', '=', 'store_notification.idShows')
                                                ->join('account', 'account.id', '=', 'store_notification.idusersend')
                                                ->orderBy('id', 'desc')
                                                ->get(array('store_notification.*', 'shows.name as storeName', 'shows.icon', 'shows.id as storeId', 'account.name', 'account.lastname', 'shows.image as StoreCover'));

        $friends = \App\Models\FriendRequest::where('idAccount2', '=', $id)
                                     ->join('account', 'account.id', '=', 'friend_request.idAccount1')
                                     ->get(array('account.*', 'friend_request.id as IDRequest', 'friend_request.idAccount1', 'friend_request.idAccount2'));
                                                                                    
        return response()->json([
                "notifications" => array_merge(array_merge($notification->toArray(), $notification2->toArray()), $notification3->toArray()),
                "requests" => $friends
            ]);
    }
}
