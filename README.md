# Cadastro de empresas

Esse projeto Laravel foi feito para a tarefa do processo seletivo de desenvolvedor
júnior da Telepesquisa.

## Pré-requisitos

* [PHP & Composer](https://laravel.com/docs/12.x/installation)
    - php 8.4.x
    - composer 2.8.x
* [Sail](https://laravel.com/docs/12.x/sail)
* WSL2 (para usuários Windows) ou Linux/macOS.

## Instruções de Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/PedroAug91/Tarefa-TelePesquisa.git
    cd Tarefa-TelePesquisa
    ```

2.  **Copie o arquivo de ambiente:**
    ```bash
    cp .env.example .env
    ```
    *Observação: Revise o arquivo `.env` e ajuste as configurações de banco de dados e outras variáveis de ambiente conforme necessário. Por padrão, o Sail utilizará as configurações definidas para ele.*

3.  **Instale as dependências do Composer (usando o Sail):**
    Se você já tem um alias para o `sail` ou o executável `sail` no seu projeto (geralmente após rodar `php artisan sail:install`), pode usar:
    ```bash
    ./vendor/bin/sail composer install
    ```

4.  **Inicie os containers do Sail:**
    ```bash
    ./vendor/bin/sail up -d
    ```
    *(O `-d` executa os containers em modo "detached" - em segundo plano).*

5.  **Gere a chave da aplicação (se ainda não estiver no `.env`):**
    ```bash
    ./vendor/bin/sail artisan key:generate
    ```

6.  **Execute as migrações do banco de dados:**
    ```bash
    ./vendor/bin/sail artisan migrate
    ```

7. **Inicie o VITE:**
    ```bash
    ./vendor/bin/sail npm install
    ./vendor/bin/sail npm run dev
    ```

8.  **Acesse a aplicação:**
    Abra seu navegador e acesse: [http://localhost](http://localhost) (ou a porta definida na variável `APP_PORT` no seu arquivo `.env`, se diferente da porta 80).

