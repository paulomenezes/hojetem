<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Hash;
use \Input;

class StoreOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index($user)
    {
        $stores = \App\Models\StoreOrder::where("idAccount", '=', $user)->get();

        for ($i=0; $i < sizeof($stores); $i++) { 
            $stores[$i]['itens'] = \App\Models\StoreOrderItem::where('store_order_item.idOrder', '=', $stores[$i]['id'])
                                                             ->join('store_menu', 'store_menu.id', '=', 'store_order_item.idItem')
                                                             ->get(array('store_order_item.*', 'store_menu.price', 'store_menu.name', 'store_menu.image', 'store_menu.description'));
        }

        return response()->json($stores->toArray());
    }


    public function store(Request $request)
    {
          $user = new \App\Models\StoreOrder();
          $user->idAccount = Input::json()->all()['idAccount'];
          $user->idStore = Input::json()->all()['idStore'];
          $user->payment = Input::json()->all()['payment'];
          $user->obs = Input::json()->all()['obs'];
          $user->troco = Input::json()->all()['troco'];
          $user->telefone = Input::json()->all()['phone'];
          $user->endereco = Input::json()->all()['address'];
          $user->save();

          $arr = Input::json()->all()['itens'];

          for ($i=0; $i < sizeof($arr); $i++) { 
              $item = new \App\Models\StoreOrderItem();
              $item->idOrder = $user->id;
              $item->idItem = $arr[$i]['id'];
              $item->quantity = $arr[$i]['quantity'];
              $item->save();
          }

          return response()->json(['id' => $user->id]);
    }
}
