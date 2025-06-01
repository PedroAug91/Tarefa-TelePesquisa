<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Segmentos extends Model
{
    /*
     * The attributes that are mass assignable.
     *
     * @var array<string>
     * */

    protected $fillable = [
        "tipo"
    ];

    public function empresas() {
        return $this->hasMany(Empresas::class);
    }
}
