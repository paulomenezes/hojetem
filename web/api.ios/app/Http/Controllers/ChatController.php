<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Hash;

use DB;
use \Input;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index($chat)
    {
        $stores = \App\Models\ChatMessenger::where("idchat", '=', $chat)->orderBy('id', 'asc')->get();

        return response()->json($stores->toArray());
    }

    public function room($room)
    {
        $stores = \App\Models\ChatMessenger::join('account', 'account.id', '=', 'chat_messenger.iduser')
                                           ->where("chat_messenger.idroom", '=', $room)
                                           ->orderBy('chat_messenger.id', 'asc')
                                           ->get(array('chat_messenger.*', 'account.name', 'account.lastname', 'account.image', 'account.facebookID'));

        return response()->json($stores->toArray());
    }

    public function rooms($user)
    {
        $stores = \App\Models\ChatRoom::join('account', 'account.id', '=', 'chat_room.idAccount')
                                        ->where("chat_room.type", '=', 'Pública')
                                        ->get(array('chat_room.*', 'account.name as UserName', 'account.lastname', 'account.image'));

        $members = \App\Models\ChatMembers::where("chat_members.idAccount", '=', $user)->where('accept', '=', '1')->distinct()->get(array('idRoom', 'accept'))->toArray();
        $requests = \App\Models\ChatMembers::where("chat_members.idAccount", '=', $user)->where('accept', '=', '0')->distinct()->get(array('idRoom', 'accept'))->toArray();
    
        /*$stores2 = \App\Models\ChatRoom::join('account', 'account.id', '=', 'chat_room.idAccount')
                                        ->leftJoin('chat_members', 'chat_members.idRoom', '=', 'chat_room.id')
                                       ->where("chat_room.type", '=', 'Privada')
                                       ->whereIn('chat_room.id', $members)
                                        ->groupBy('chat_room.id')
                                       ->get(array('chat_room.*', 'account.name as UserName', 'account.lastname', 'account.image', DB::raw('count(chat_members.idRoom) as members'))); */

        $stores3 = \App\Models\ChatRoom::join('account', 'account.id', '=', 'chat_room.idAccount')
                                       ->leftJoin('chat_members', 'chat_members.idRoom', '=', DB::raw('chat_room.id AND chat_members.accept = 1'))
                                       ->where('chat_room.type', '=', 'Privada')
                                       ->groupBy('chat_room.id')
                                       ->get(array('chat_room.*', 'account.name as UserName', 'account.lastname', 'account.image', DB::raw('count(chat_members.idRoom) as members'))); 
    
        return response()->json([
             'rooms' => array_merge($stores->toArray(), $stores3->toArray()),
             'members' => $members,
             'requests' => $requests
        ]);
    }

    public function members($room)
    {
        $members = \App\Models\ChatMembers::where("chat_members.idRoom", '=', $room)
                                            ->join('account', 'account.id', '=', 'chat_members.idAccount')
                                            ->get(array('account.*', 'chat_members.accept', 'chat_members.id as IDMember'));
        
        return response()->json($members->toArray());
    }

    public function accept($member)
    {
        $user = \App\Models\ChatMembers::find($member);
        $user->accept = 1;
        $user->save();
        
        return response()->json([
                "msg" => "Success"
            ], 200); 
    }

    public function remove($member)
    {
        $user = \App\Models\ChatMembers::find($member);
        $user->delete();

        return response()->json([
                "msg" => "Success"
            ], 200); 
    }

    public function storeMember(Request $request)
    {
        $idAccount = Input::json()->all()['idAccount'];
        $idRoom = Input::json()->all()['idRoom'];
        $accept = Input::json()->all()['accept'];

        $user = new \App\Models\ChatMembers();
        $user->idAccount = $idAccount;
        $user->idRoom = $idRoom;
        $user->accept = $accept;

        $room = \App\Models\ChatRoom::find($idRoom);
        $user1 = \App\Models\User::find($room['idAccount']);
        $user2 = \App\Models\User::find($idAccount);

        if ($user1['gcm_regid']) {
            $result = $this->send_notification(array($user1['gcm_regid']), array(
                                        "msg" => $user2['name'] . " quer entrar na sua sala.",
                                        "title" => $user2['name'] . " " . $user2["lastname"],
                                        "action" => "Group",
                                        "image" => $user2['image']
                                    ));
        }

        $user->save();

        return response()->json(['id' => $user->id ]);
    }

    public function storeRoom(Request $request)
    {
        $name = Input::json()->all()['name'];
        $idAccount = Input::json()->all()['idAccount'];
        $type = Input::json()->all()['type'];

        $user = new \App\Models\ChatRoom();
        $user->name = $name;
        $user->idAccount = $idAccount;
        $user->type = $type;

        $user->save();

        for ($i=0; $i < sizeof(Input::json()->all()['users']); $i++) { 
            $member = new \App\Models\ChatMembers();
            $member->idAccount = Input::json()->all()['users'][$i];
            $member->idRoom = $user->id;
            $member->accept = 1;

            $member->save();
        }

        return response()->json(['id' => $user->id, 'users' => Input::json()->all()['users'] ]);
    }

    public function store(Request $request)
    {
        $text = Input::json()->all()['text'];
        $iduser = Input::json()->all()['iduser'];

        $user = new \App\Models\ChatMessenger();
        $user->text = $text;
        $user->iduser = $iduser;
        $user->platform = 1;
        if (array_key_exists('idchat', Input::json()->all())) {
            $idchat = Input::json()->all()['idchat'];

            $user->idchat = $idchat;

            $user1 = \App\Models\Friend::find($idchat);
            if ($user1->idAccount1 == $iduser) {
                $user2 = \App\Models\User::find($user1->idAccount2); // eu
                $user0 = \App\Models\User::find($user1->idAccount1); // saulo
            } else {
                $user2 = \App\Models\User::find($user1->idAccount1);
                $user0 = \App\Models\User::find($user1->idAccount2);
            }

            if ($user2['gcm_regid']) {
                $result = $this->send_notification(array($user2['gcm_regid']), array(
                                            "msg" => "Você tem uma nova mensagem.",
                                            "title" => $user0['name'] . " " . $user0["lastname"],
                                            "action" => "Chat",
                                            "image" => $user0['image'],
                                            "name" => "accountGet",
                                            "value" => $user2['id']
                                        ));
            }

            // $notification = new \App\Models\Notification();
            // $notification->message = "Você tem uma nova mensagem.";
            // $notification->read = 0;
            // $notification->idusersend = $request->iduser;
            // $notification->iduserreceiver = $user2['id'];
            // $notification->save();
        } else {
            $user->idroom = Input::json()->all()['idroom'];
        }
        $user->save();

        return response()->json(['id' => $user->id ]);
    }

    public function destroy($id)
    {
        $user = \App\Models\ChatMessenger::find($id);
        $user->delete();

        return response()->json([
                "msg" => "Success"
            ], 200); 
    }
}
