<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Http\Controllers;
use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

/**
 * Description of MainController
 *
 * @author pirog
 */
class MainController {
    public function __construct() {
    }
    //put your code here
    private function save(Request $request) {
        
        $name = $request->input('name');
        $surname = $request->input('surrname');
        $desc = $request->input('desc');
        $phone = $request->input('phone');
        $city = $request->input('city');
        $street = $request->input('street');
        $lat = $request->input('lat');
        $lng = $request->input('lng');

        $data = array(
            'name' => $name,
            'surrname' => $surname,
            'desc' => $desc,
            'phone' => $phone,
            'city' => $city,
            'street' => $street,
            'latitude' => $lat,
            'longitude' => $lng
        );
        
        \DB::table('users')->insert($data); 
         return Redirect('/');
    }
    private function update(Request $request) {
        
        $name = $request->input('name');
        $surname = $request->input('surrname');
        $desc = $request->input('desc');
        $phone = $request->input('phone');
        $city = $request->input('city');
        $street = $request->input('street');
        $lat = $request->input('lat');
        $lng = $request->input('lng');
        $id = $request->input('id');
        var_dump($id);
        $data = array(
            'name' => $name,
            'surrname' => $surname,
            'desc' => $desc,
            'phone' => $phone,
            'city' => $city,
            'street' => $street,
            'latitude' => $lat,
            'longitude' => $lng
        );
        
        \DB::table('users')
                ->where('id',$id)
                ->update($data); 
         return Redirect('/');
    }

    public function addUser(Request $request) {

        $rules = array(
            'name' => 'required',
            'surrname' => 'required',
            'desc' => 'required',
            'lat' => 'required',
            'phone' => 'required',
            'lng' => 'required',
            'city' => 'required',
            'street' => 'required'
        );
        $validator = Validator::make($request->all(), $rules);


        if ($validator->fails()) {
            return Redirect('/')
                            ->withErrors($validator);
        } else {
            return $this->save($request);
        }
    }
    public function editUser(Request $request) {

        $rules = array(
            'name' => 'required',
            'surrname' => 'required',
            'desc' => 'required',
            'lat' => 'required',
            'phone' => 'required',
            'lng' => 'required',
            'city' => 'required',
            'street' => 'required'
        );
        $validator = Validator::make($request->all(), $rules);


        if ($validator->fails()) {
            return Redirect('/')
                            ->withErrors($validator);
        } else {
            return $this->update($request);
        }
    }
    
     public function deleteRow(Request $request){
      
        $id = '';
        $id = (int)$request->row;
            //$user = new User;
        $user = User::find($id);
        if($user->delete()){
            return response()->json([
             'success'=>'AJAX_OK',
         ]); 
        }
        else{
             return response()->json([
             'success'=>'ERROR',
         ]); 
        }
        
       
         return response()->json([
             'success'=>'AJAX_OK',
         ]);
    }
}

?>