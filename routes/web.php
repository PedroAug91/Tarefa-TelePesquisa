<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EmpresasController;

Route::get("/", [EmpresasController::class, "create"])
    ->middleware(["auth", "verified"])
    ->name("empresas.create");

Route::post("/", [EmpresasController::class, "store"])
    ->middleware(["auth", "verified"])
    ->name(("empresas.store"));

Route::middleware("auth")->group(function () {
    Route::get("/profile", [ProfileController::class, "edit"])->name("profile.edit");
    Route::patch("/profile", [ProfileController::class, "update"])->name("profile.update");
    Route::delete("/profile", [ProfileController::class, "destroy"])->name("profile.destroy");
});


require __DIR__."/auth.php";
