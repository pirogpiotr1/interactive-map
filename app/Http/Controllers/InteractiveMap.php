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
class InteractiveMap {
    
    private $google_key;
    
    public function __construct() {
        $this->google_key = '' ;
    }
    
    public function defaultAction(){
        
    }
    public function loadPartners(Request $request){
      
        $partners = '';
        $partners = $request->partners;
        $view = \View::make('partners',['partners' => $partners])->render();
        $html = (string)$view;
        
         return response()->json([
             'success'=>'AJAX_OK',
             'html' => $html
         ]);
    }

}

?>