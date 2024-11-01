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
     {
       "user": "test@email.com",
       "password": "12345",
       "stay": "true"
     }
*   `GET /auth` - Verifica se o usuário está autenticado usando o token de acesso. Se o token estiver expirado, tenta renovar com o refresh token.

Banco de Dados
--------------

Crie uma tabela `users` no PostgreSQL com o seguinte esquema:

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      user VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
Cadastre um usuario na tabela users no banco de dados (O usuario deve ser um email, e a senha deve estar Criptografada em Bcrypt gere aqui => https://bcrypt-generator.com

    INSERT INTO users
      ("user", password)
      VALUES
      ('test@email.com', '$2a$12$uiGs5Nmqkg7NlPvPuLVgZeH0kDNPPNnCWSMy.jfhHZrImvfiHHVd.')


Tecnologias
-----------

*   Fastify
*   jsonwebtoken
*   bcryptjs
*   pg
