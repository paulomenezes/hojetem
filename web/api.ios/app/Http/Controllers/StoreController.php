<?php

    namespace App\Http\Controllers;

    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;

    use Illuminate\Support\Facades\Hash;

    use DB;
    use \Input;

    class StoreController extends Controller
    {
        /**
         * Display a listing of the resource.
         *
         * @return Response
         */
        public function index($tipo)
        {
            if ($tipo == 'today') {
                $users = \App\Models\Store::whereDay('event_date', '=', date('d'))
                                            ->whereMonth('event_date', '=', date('m'))
                                            ->whereYear('event_date', '=', date('Y'))->get();

                return response()->json($users->toArray());
            } else if ($tipo == 'week') {
                $daysAgo = date('Y-m-d', strtotime('-0 days', strtotime(date('Y-m-d'))));
                $days2 = date('Y-m-d', strtotime('+3 days', strtotime(date('Y-m-d'))));

                $users = \App\Models\Store::whereBetween(DB::raw('date(event_date)'), [$daysAgo, $days2])->get();
                return response()->json($users->toArray());
            } else if ($tipo == 'month') {
                $users = \App\Models\Store::whereMonth('event_date', '=', date('m'))
                                            ->whereYear('event_date', '=', date('Y'))
                                            ->whereDay('event_date', '>=', date('d'))->get();
                return response()->json($users->toArray());
            } else {
                $users = \App\Models\Store::whereMonth('event_date', '>', date('m'))->get();
                return response()->json($users->toArray());
            }
        }

        public function get($id)
        {
            $users = \App\Models\Store::find($id);

            return response()->json($users->toArray());
        }

        public function getSchedule($id)
        {
            $users = \App\Models\StoreSchedule::where('idStore', '=', $id)->orderBy('dayOfWeek', 'asc')->get();

            return response()->json($users->toArray());
        }

        public function visited()
        {
            $users = \App\Models\Store::select(DB::raw('count(store_visited.idStore) as visited, store.*'))
                                      ->leftJoin('store_visited', function ($join)
                                      {
                                            $join->on('store_visited.idStore', '=', 'store.id')
                                                ->where('store_visited.idVisitedType', '=', '1');
                                      })
                                      ->orderBy('visited', 'desc')
                                      ->groupBy('store.id')
                                      ->get();

            return response()->json($users->toArray());
        }

        public function extras($store)
        {
            $users = \App\Models\StoreExtra::where('idStore', '=', $store)->get();

            return response()->json($users->toArray());
        }

        public function schedule($store)
        {
            $users = \App\Models\StoreSchedule::where('idStore', '=', $store)->get();

            return response()->json($users->toArray());
        }

        public function menu($store)
        {
            $users = \App\Models\StoreMenu::where('idStore', '=', $store)->orderBy('type', 'asc')->get();

            return response()->json($users->toArray());
        }

        public function find()
        {
            $type = Input::json()->all()['type'];
            $search = Input::json()->all()['search'];
            $selected = explode(",", Input::json()->all()['selected']);

            $user = '';
            if ($type == 'Por data') {
                $user = \App\Models\Store::where('name', 'LIKE', '%' . $search . '%')
                                         ->whereMonth('event_date', '>=', date('m'))
                                         ->whereYear('event_date', '>=', date('Y'))
                                         ->whereDay('event_date', '>=', date('d'))
                                         ->orderBy('event_date', 'asc')->get();
            } else if ($type == 'Por confirmação') {
                $user = \App\Models\Store::select(DB::raw('count(store_visited.idStore) as visited, store.*'))
                                          ->leftJoin('store_visited', function ($join)
                                          {
                                                $join->on('store_visited.idStore', '=', 'store.id')
                                                    ->where('store_visited.idVisitedType', '=', '1');
                                          })
                                          ->where('name', 'LIKE', '%' . $search . '%')
                                          ->whereMonth('event_date', '>=', date('m'))
                                          ->whereYear('event_date', '>=', date('Y'))
                                          ->whereDay('event_date', '>=', date('d'))
                                          ->orderBy('visited', 'desc')
                                          ->groupBy('store.id')
                                          ->get();
            } else if ($type == 'Por tipo') {
                $user = array();
                for ($i=0; $i < sizeof($selected); $i++) { 
                    $store_types = \App\Models\StoreType::where('name', '=', str_replace('"', '', $selected[$i]))->get();

                    if (sizeof($store_types->toArray()) > 0) {
                        $finds = \App\Models\Store::where('name', 'LIKE', '%' . $search . '%')
                                                 ->where('subtype', 'LIKE', '%,' . $store_types->toArray()[0]['id'] . ',%')
                                                 ->whereMonth('event_date', '>=', date('m'))
                                                 ->whereYear('event_date', '>=', date('Y'))
                                                 ->whereDay('event_date', '>=', date('d'))
                                                 ->get();

                        //var_dump($finds->toArray());
                        $user = array_merge($user, $finds->toArray());
                    }                    
                }
            }
                                    
            return response()->json($user, 200);
        }

        public function checkins($store)
        {
            $friends = \App\Models\StoreCheckin::where('idStore', '=', $store)
                                         ->join('store', 'store.id', '=', 'store_checkin.idStore')
                                         ->join('account', 'account.id', '=', 'store_checkin.idAccount')
                                         ->get(array('store.*', 'account.id as User', 'account.name as UserName', 'account.lastname as UserLastname', 'account.image as UserImage', 'store_checkin.message', 'store_checkin.image as CheckinImage'));

            return response()->json($friends, 200);
        }

        public function checkinsComment($id)
        {
            $friends = \App\Models\StoreCheckinComment::where('idCheckin', '=', $id)
                                         ->join('account', 'account.id', '=', 'store_checkin_comment.idUser')
                                         ->get(array('store_checkin_comment.id as idComment', 'store_checkin_comment.message', 'account.*'));

            return response()->json($friends, 200);
        }

        public function checkinsUser($id)
        {
            $friends = \App\Models\StoreCheckin::find($id);
            $users = explode(', ', $friends['users']);
            $u = array();
            for ($i=0; $i < sizeof($users) - 1; $i++) { 
                $user = \App\Models\User::find($users[$i]);
                $visited = \App\Models\StoreVisited::where('idAccount', '=',  $user->id)
                                                   ->where('idCheckin', '=', $id)
                                                   ->get();
                if (sizeof($visited) > 0) {
                    $user['visited'] = $visited[0]->idVisitedType;
                } else {
                    $user['visited'] = -1;
                }

                array_push($u, $user);
            }

            return response()->json($u, 200);
        }

        public function checkinsCommentStore(Request $request)
        {
            $idAccount = Input::json()->all()['idUser'];
            $idCheckin = Input::json()->all()['idCheckin'];
            $message = Input::json()->all()['message'];

            $user = new \App\Models\StoreCheckinComment();
            $user->idUser = $idAccount;
            $user->idCheckin = $idCheckin;
            $user->message = $message;
            $user->save();

            return response()->json(["id" => $user->id]);
        }

        public function checkinStore(Request $request)
        {
            $idAccount = Input::json()->all()['idAccount'];
            $message = Input::json()->all()['message'];
            
            $users = null;
            if (array_key_exists('users', Input::json()->all())) {
                $users = Input::json()->all()['users'];
            }

            $user = new \App\Models\StoreCheckin();
            $user->idAccount = $idAccount;
            if (array_key_exists('idStore', Input::json()->all())) {
                $user->idStore = Input::json()->all()['idStore'];
            } else {
                $user->idShows = Input::json()->all()['idShows'];
            }
            $user->message = $message;
            if ($users) {
                $user->users = $users;

                $user1 = \App\Models\User::find($idAccount);

                $u = explode(',', $users);
                for ($i=0; $i < sizeof($u); $i++) { 
                    $user2 = \App\Models\User::find(trim($u[$i]));

                    if ($user2) {
                        if ($user2['gcm_regid']) {
                            $result = $this->send_notification(array($user2['gcm_regid']), array(
                                                        "msg" => "Marcou um encontro com você.",
                                                        "title" => $user1['name'] . " " . $user1["lastname"],
                                                        "action" => "Meeting",
                                                        "image" => $user1['image'],
                                                        "name" => "fragment",
                                                        "value" => "1"
                                                    ));
                        }

                        $user->save();

                        $notification = new \App\Models\Notification();
                        $notification->message = $message;
                        $notification->read = 0;
                        if (array_key_exists('idStore', Input::json()->all())) {
                            $notification->idStore = Input::json()->all()['idStore'];
                        } else {
                            $notification->idShows = Input::json()->all()['idShows'];
                        }
                        $notification->idCheckin = $user->id;
                        $notification->idusersend = $idAccount;
                        $notification->iduserreceiver = $user2['id'];
                        $notification->save();
                    }
                }
            }
            
            if (Input::json()->all()['change']) {
                $filename = 'images/checkins/Achow_' . md5(uniqid(rand(), true)) . '.jpg'; 
                $user->image = $filename; // Input::json()->all()['image'];
                $user->save();

                $ifp = fopen('../../' . $filename, 'w+');
                $data = explode(',', Input::json()->all()['image']);
                fwrite($ifp, base64_decode($data[1]));
                fclose($ifp);

                return response()->json([
                    'id' => $user->id,
                    "image" => $filename
                ]);
            } else {
                $user->save();
                
                return response()->json(['id' => $user->id]);
            }
        }
    }
