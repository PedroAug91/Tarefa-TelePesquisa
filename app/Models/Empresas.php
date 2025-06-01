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
        "cnpj",
        "cep",
        "rua",
        "numero",
        "bairro",
        "estado",
        "segmento_id"
    ];

    public function segmento() {
        return $this->belongsTo(Segmentos::class);
    }
}
