 Fastify Auth JWT body { font-family: Arial, sans-serif; margin: 20px; } h1 { color: aqua; } h2 { color: green; } pre code { background-color: black; color: #c79176; padding: 10px; overflow: auto; } code { background-color: #f4f4f4; color: black; padding: 2px 4px; } ul { list-style-type: disc; margin-left: 20px; } ol { margin-left: 20px; } li { margin-bottom: 10px; } a { color: #1a73e8; text-decoration: none; } a:hover { text-decoration: underline; }

Fastify Auth JWT
================

Um sistema de autenticação simples implementado com Fastify, JWT e PostgreSQL. Este projeto demonstra como realizar a autenticação de usuários, gerenciar tokens JWT e persistir sessões usando cookies.

Funcionalidades
---------------

*   Login de usuários com verificação de senha usando bcrypt.
*   Geração de tokens JWT (token de acesso e refresh token).
*   Persistência de sessão via cookies, com opção de manter o usuário logado.
*   Verificação de autenticação em rotas protegidas.
*   Refresh de tokens de acesso quando expiram, usando o refresh token.

Pré-requisitos
--------------

*   [Node.js](https://nodejs.org/en/download/) (versão 14 ou superior)
*   [PostgreSQL](https://www.postgresql.org/download/)
*   Configuração de variáveis de ambiente (veja o exemplo abaixo)

Instalação
----------

1.  Clone o repositório:
    
        git clone https://github.com/diogod2r/fastify-auth-jwt.git
        cd fastify-auth-jwt
    
2.  Instale as dependências:
    
        npm install
    
3.  Configure as variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
    
        srvPORT=3000
        srvHOST=127.0.0.1
        dbHOST=localhost
        dbUSER=seu_usuario
        dbNAME=seu_banco
        dbPASS=sua_senha
        dbPORT=5432
        secretKeyA=sua_secret_key_access
        secretKeyR=sua_secret_key_refresh
    
4.  Execute a aplicação:
    
        npm run dev
    
5.  A aplicação estará rodando em [http://localhost:3000](http://localhost:3000).

Rotas
-----

*   `POST /signin` - Realiza o login de um usuário, retornando tokens JWT e cookies.
*   `GET /auth` - Verifica se o usuário está autenticado usando o token de acesso. Se o token estiver expirado, tenta renovar com o refresh token.

Banco de Dados
--------------

Crie uma tabela `users` no PostgreSQL com o seguinte esquema:

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      user VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );

Tecnologias
-----------

*   Fastify
*   jsonwebtoken
*   bcryptjs
*   pg
