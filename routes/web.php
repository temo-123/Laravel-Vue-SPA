<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

Route::domain(config('app.url'))->group(function () {
    Route::group(['namespace'=>'Site'], function() {
        Route::get('/{any}', 'IndexController@index')->where('any', '(.*)')->name('index');
    });
});

Route::domain('user.' . config('app.url'))->group(function () {
    Route::group(['namespace'=>'User'], function() {
        Route::get('/{any}', 'IndexController@index')->where('any', '(.*)')->name('user_index');
    });
});


Auth::routes(['verify' => true]);

Auth::routes();

// Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
