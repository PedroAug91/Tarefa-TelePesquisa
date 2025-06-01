import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";

function isValidCPF(cpf) {
    if (typeof cpf !== "string") return false;

    cpf = cpf.replace(/[^\d]+g/, '');

    if (cpf.length !== 11 || !!cpf.match(/(\d)1{10}/)) return false

    cpf = cpf.split("").map(el => +el);
    const rest = (count) => (cpf.slice(0, count-12).reduce( (soma, el, index) => (soma + el * (count-index)), 0 )*10) % 11 % 10;
    return rest(10) === cpf[9] && rest(11) === cpf[10];
}

function isValidCNPJ(cnpj) {
    if (typeof cnpj !== 'string') return false;
    cnpj = cnpj.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

    if (cnpj.length !== 14 || !!cnpj.match(/(\d)\1{13}/)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
}

export default function CreateEmpresaForm({ auth, flash, errors: pageErrors, segmentos }) {
    const { data, setData, post, processing, errors: backendErrors, reset } = useForm({
        nome: '',
        telefone: '',
        cpf: '',
        cnpj: '',
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        estado: '',
        segmento_id: segmentos.length === 0 ? '_OTHER_VALUE_' : '',
        segmento_tipo: '',
    });

    const [cpfError, setCpfError] = useState('');
    const [cnpjError, setCnpjError] = useState('');
    const allBackendErrors = { ...backendErrors, ...pageErrors };



    const handleCpfChange = (e) => {
        const value = e.target.value;
        setData('cpf', value);
        if (value && !isValidCPF(value)) setCpfError('CPF inválido.');
            else setCpfError('');
    };

    const handleCnpjChange = (e) => {
        const value = e.target.value;
        setData('cnpj', value);
        if (value && !isValidCNPJ(value)) setCnpjError('CNPJ inválido.');
            else setCnpjError('');
    };

    const submit = (e) => {
        e.preventDefault();
        let validForm = true;
        if (data.cpf && !isValidCPF(data.cpf)) { setCpfError('CPF inválido.'); validForm = false; }
        if (data.cnpj && !isValidCNPJ(data.cnpj)) { setCnpjError('CNPJ inválido.'); validForm = false; }

        if (data.segmento_id === '_OTHER_VALUE_' && !data.segmento_tipo.trim()) {
            allBackendErrors.segmento_tipo = 'Especifique o nome do novo segmento.';
            validForm = false;
        } else if (data.segmento_id !== '_OTHER_VALUE_' && !data.segmento_id) {
            allBackendErrors.segmento_id = 'Selecione um segmento.';
            validForm = false;
        }

        if (validForm) {
            post(route('empresas.store'), {
                onSuccess: () => {
                    reset();
                    setCpfError('');
                    setCnpjError('');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 light:text-gray-200 leading-tight">Cadastrar Nova Empresa</h2>}
        >
            <Head title="Cadastrar Empresa" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white light:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 light:text-gray-100">

                            {flash && flash.success && (
                                <div
                                    className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg light:bg-green-900 light:text-green-300"
                                    role="alert"
                                >
                                    {flash.success}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="nome" value="Nome da Empresa*" />
                                    <TextInput id="nome" name="nome" value={data.nome} className="mt-1 block w-full" autoComplete="organization" isFocused={true} onChange={(e) => setData('nome', e.target.value)} required />
                                    <InputError message={allBackendErrors.nome} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="telefone" value="Telefone" />
                                    <TextInput id="telefone" name="telefone" type="tel" value={data.telefone} className="mt-1 block w-full" autoComplete="tel" onChange={(e) => setData('telefone', e.target.value)} />
                                    <InputError message={allBackendErrors.telefone} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="cpf" value="CPF" />
                                    <TextInput id="cpf" name="cpf" value={data.cpf} className="mt-1 block w-full" onChange={handleCpfChange} placeholder="Digite o CPF (apenas números)" />
                                    {cpfError && <p className="text-sm text-red-600 light:text-red-400 mt-2">{cpfError}</p>}
                                    <InputError message={allBackendErrors.cpf} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="cnpj" value="CNPJ" />
                                    <TextInput id="cnpj" name="cnpj" value={data.cnpj} className="mt-1 block w-full" onChange={handleCnpjChange} placeholder="Digite o CNPJ (apenas números)" />
                                    {cnpjError && <p className="text-sm text-red-600 light:text-red-400 mt-2">{cnpjError}</p>}
                                    <InputError message={allBackendErrors.cnpj} className="mt-2" />
                                </div>
                                {(allBackendErrors.cpf && allBackendErrors.cpf.includes('obrigatório')) || (allBackendErrors.cnpj && allBackendErrors.cnpj.includes('obrigatório')) ? (
                                    <p className="text-sm text-red-600 light:text-red-400 mt-2">
                                        É obrigatório informar um CPF ou um CNPJ.
                                    </p>
                                ) : null}

                                <hr className="my-6 border-gray-300 light:border-gray-700" />
                                <p className="text-lg font-semibold">Segmento da Empresa</p>

                                {/* Campo Select para Segmento */}
                                <div>
                                    <InputLabel htmlFor="segmento_id" value="Segmento*" />
                                    <select
                                        id="segmento_id" // ATUALIZADO
                                        name="segmento_id" // ATUALIZADO
                                        value={data.segmento_id} // ATUALIZADO
                                        onChange={(e) => setData('segmento_id', e.target.value)} // ATUALIZADO
                                        className="mt-1 block w-full border-gray-300 light:border-gray-700 light:bg-gray-900 light:text-gray-300 focus:border-indigo-500 light:focus:border-indigo-600 focus:ring-indigo-500 light:focus:ring-indigo-600 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">-- Selecione um segmento --</option>
                                        {segmentos.map((seg) => (
                                            <option key={seg.id} value={seg.id}>
                                                {seg.tipo}
                                            </option>
                                        ))}
                                        <option value="_OTHER_VALUE_">Outro (especificar)</option>
                                    </select>
                                    <InputError message={allBackendErrors.segmento_id} className="mt-2" /> {/* ATUALIZADO */}
                                </div>

                                {/* Campo de Texto para Novo Segmento (condicional) */}
                                {data.segmento_id === '_OTHER_VALUE_' && ( // ATUALIZADO para data.segmento_id
                                    <div className="mt-4">
                                        <InputLabel htmlFor="segmento_tipo" value="Nome do Novo Segmento*" /> {/* ATUALIZADO */}
                                        <TextInput
                                            id="segmento_tipo" // ATUALIZADO
                                            name="segmento_tipo" // ATUALIZADO
                                            value={data.segmento_tipo} // ATUALIZADO
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('segmento_tipo', e.target.value)} // ATUALIZADO
                                            required={data.segmento_id === '_OTHER_VALUE_'} // ATUALIZADO
                                        />
                                        <InputError message={allBackendErrors.segmento_tipo} className="mt-2" /> {/* ATUALIZADO */}
                                    </div>
                                )}

                                <hr className="my-6 border-gray-300 light:border-gray-700" />
                                <p className="text-lg font-semibold">Endereço</p>
                                {/* ... Campos de Endereço CEP, Rua, Numero, Bairro, Estado como antes ... */}
                                {/* (Mantidos como na resposta anterior) */}
                                <div>
                                    <InputLabel htmlFor="cep" value="CEP*" />
                                    <TextInput id="cep" name="cep" value={data.cep} className="mt-1 block w-full" autoComplete="postal-code" onChange={(e) => setData('cep', e.target.value)} required />
                                    <InputError message={allBackendErrors.cep} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="rua" value="Rua/Logradouro*" />
                                    <TextInput id="rua" name="rua" value={data.rua} className="mt-1 block w-full" autoComplete="address-line1" onChange={(e) => setData('rua', e.target.value)} required />
                                    <InputError message={allBackendErrors.rua} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="numero" value="Número*" />
                                    <TextInput id="numero" name="numero" value={data.numero} className="mt-1 block w-full" onChange={(e) => setData('numero', e.target.value)} required />
                                    <InputError message={allBackendErrors.numero} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="bairro" value="Bairro*" />
                                    <TextInput id="bairro" name="bairro" value={data.bairro} className="mt-1 block w-full" autoComplete="address-level2" onChange={(e) => setData('bairro', e.target.value)} required />
                                    <InputError message={allBackendErrors.bairro} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="estado" value="Estado/UF*" />
                                    <TextInput id="estado" name="estado" value={data.estado} className="mt-1 block w-full" autoComplete="address-level1" onChange={(e) => setData('estado', e.target.value)} required />
                                    <InputError message={allBackendErrors.estado} className="mt-2" />
                                </div>


                                <div className="flex items-center justify-end mt-6">
                                    <PrimaryButton className="ms-4" disabled={processing || cpfError || cnpjError}>
                                        {processing ? 'Cadastrando...' : 'Cadastrar Empresa'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


