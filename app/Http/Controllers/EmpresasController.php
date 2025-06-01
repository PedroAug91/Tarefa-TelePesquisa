<?php

namespace App\Http\Controllers;

use App\Models\Empresas;
use App\Models\Segmentos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class EmpresasController extends Controller
{
    /*
     * Mostra o formulário para registrar uma nova empresa
     * */

    public function create() {
        $segmentos = Segmentos::orderBy("tipo")->get(["id", "tipo"]);
        return Inertia::render("Empresas/Create", [
            "segmentos" => $segmentos,
        ]);
    }


    /*
     * Armazena uma nova empresa
     * */

    public function store(Request $request) {
        $validatedCommonData = $request->validate([
            'nome' => 'required|string|max:255',
            'telefone' => 'nullable|string|max:20',
            'cpf' => ['nullable', 'required_without_all:cnpj', 'string', 'max:14', 'unique:empresas,cpf'],
            'cnpj' => ['nullable', 'required_without_all:cpf', 'string', 'max:18', 'unique:empresas,cnpj'],
            'cep' => 'required|string|max:9',
            'rua' => 'required|string|max:255',
            'numero' => 'required|string|max:50',
            'bairro' => 'required|string|max:100',
            'estado' => 'required|string|max:100',
            'segmento_id' => 'required|string',
            'segmento_tipo' => ['nullable', 'string', 'max:255'],
        ]);

        $segmentoIdParaSalvar = null;

        if ($request->input('segmento_id') === '_OTHER_VALUE_') {
            $request->validate([
                'segmento_tipo' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('segmentos', 'tipo'),
                ],
            ]);
            $novoSegmento = Segmentos::create(['tipo' => $request->input('segmento_tipo')]);
            $segmentoIdParaSalvar = $novoSegmento->id;
        } else {
            $request->validate([
                'segmento_id' => ['required', Rule::exists('segmentos', 'id')],
            ]);
            $segmentoIdParaSalvar = $request->input('segmento_id');
        }

        if ($segmentoIdParaSalvar === '_OTHER_VALUE_') {
             throw ValidationException::withMessages([
                'segmento_tipo' => 'O nome do novo segmento é obrigatório e não pode ser um valor reservado.',
            ]);
        }


        $dataToSave = [
            'nome' => $validatedCommonData['nome'],
            'telefone' => $validatedCommonData['telefone'],
            'cep' => $validatedCommonData['cep'],
            'rua' => $validatedCommonData['rua'],
            'numero' => $validatedCommonData['numero'],
            'bairro' => $validatedCommonData['bairro'],
            'estado' => $validatedCommonData['estado'],
            'segmento_id' => $segmentoIdParaSalvar,
            'cpf' => null,
            'cnpj' => null,
        ];

        if (!empty($validatedCommonData['cpf'])) {
            $dataToSave['cpf'] = preg_replace('/[^0-9]/', '', $validatedCommonData['cpf']);
        }
        if (!empty($validatedCommonData['cnpj'])) {
            $dataToSave['cnpj'] = preg_replace('/[^0-9]/', '', $validatedCommonData['cnpj']);
        }


        try {
            $empresas = Empresas::create($dataToSave);
            return Redirect::route('empresas.create')->with('success', 'Empresa cadastrada com sucesso!');
        } catch (\Exception $e) {
            return back()->with('error', 'Ocorreu um erro ao cadastrar a empresa: ' . $e->getMessage());
        }
    }
}
