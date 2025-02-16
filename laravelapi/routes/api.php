<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ManageHotelsController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::middleware(['auth:sanctum'])->group(function() {
    Route::post('logout', [AuthController::class, 'logout']);
});
//===========================Google login==================================
Route::post('/google-login', [AuthController::class, 'googleLogin']);


//============================Frontend=============================
Route::post('store-hotel', [ManageHotelsController::class, 'store']);
Route::get('view-hotels', [ManageHotelsController::class, 'view']);
Route::get('property-details/{id}', [ManageHotelsController::class, 'property_details']);
Route::post('update-hotel/{id}', [ManageHotelsController::class, 'update']);
Route::delete('delete-hotel/{id}', [ManageHotelsController::class, 'destroy']);


//=====================ADMIN==============================
Route::middleware(['auth:sanctum', 'isAPIAdmin'])->group(function() {
    Route::get('/checkingAuthenticated', function(){
    return response()->json(['message'=>'You are in', 'status'=>200], 200);
    });

});

