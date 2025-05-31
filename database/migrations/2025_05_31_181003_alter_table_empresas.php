<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->text("cep");
            $table->text("rua");
            $table->text("numero");
            $table->text("bairro");
            $table->text("estado");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->dropColumn([
                "cep",
                "rua",
                "numero",
                "bairro",
                "estado"
            ]);
        });
    }
};
