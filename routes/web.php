<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    $users = DB::table('users')->get();
    return view('users',['users' => $users ]);
});

Route::get('/map', function(){
    $users = DB::table('users')->get();
    
    $partnersJSON = json_encode($users);
    
    $path = storage_path() . "/json/area.json"; // ie: /var/www/laravel/app/storage/json/filename.json

    $json = json_encode(file_get_contents($path), true); 
    
    return view('interactive_map',[
        'users' => $partnersJSON,
        'poligons' =>  $json
        ]);
});

Route::post('/map/post', 'InteractiveMap@loadPartners');

Route::post('/addUser', 'MainController@addUser');
Route::post('/editUser', 'MainController@editUser');

Route::post('/delete' ,'MainController@deleteRow');
