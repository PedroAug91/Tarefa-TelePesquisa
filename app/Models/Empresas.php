<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresas extends Model
{
    /*
     * The attributes that are mass assignable.
     *
     * @var array<string, >
     * */

    protected $fillable = [
        "nome",
        "telefone",
        "cpf",
        "cnpj"
    ];
}
