<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Fastify Auth JWT</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: aqua; }
        h2 { color: green; }
        pre code { background-color: black; color: #c79176; padding: 10px; overflow: auto; }
        code { background-color: #f4f4f4; color: black; padding: 2px 4px; }
        ul { list-style-type: disc; margin-left: 20px; }
        ol { margin-left: 20px; }
        li { margin-bottom: 10px; }
        a { color: #1a73e8; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>

<h1>Fastify Auth JWT</h1>

<p>Um sistema de autenticação simples implementado com Fastify, JWT e PostgreSQL. Este projeto demonstra como realizar a autenticação de usuários, gerenciar tokens JWT e persistir sessões usando cookies.</p>

<h2>Funcionalidades</h2>
<ul>
    <li>Login de usuários com verificação de senha usando bcrypt.</li>
    <li>Geração de tokens JWT (token de acesso e refresh token).</li>
    <li>Persistência de sessão via cookies, com opção de manter o usuário logado.</li>
    <li>Verificação de autenticação em rotas protegidas.</li>
    <li>Refresh de tokens de acesso quando expiram, usando o refresh token.</li>
</ul>

<h2>Pré-requisitos</h2>
<ul>
    <li><a href="https://nodejs.org/en/download/">Node.js</a> (versão 14 ou superior)</li>
    <li><a href="https://www.postgresql.org/download/">PostgreSQL</a></li>
    <li>Configuração de variáveis de ambiente (veja o exemplo abaixo)</li>
</ul>

<h2>Instalação</h2>
<ol>
    <li>Clone o repositório:
        <pre><code>git clone https://github.com/diogod2r/fastify-auth-jwt.git
cd fastify-auth-jwt</code></pre>
    </li>
    <li>Instale as dependências:
        <pre><code>npm install</code></pre>
    </li>
    <li>Configure as variáveis de ambiente. Crie um arquivo <code>.env</code> na raiz do projeto e adicione as seguintes variáveis:
        <pre><code>srvPORT=3000
srvHOST=127.0.0.1
dbHOST=localhost
dbUSER=seu_usuario
dbNAME=seu_banco
dbPASS=sua_senha
dbPORT=5432
secretKeyA=sua_secret_key_access
secretKeyR=sua_secret_key_refresh</code></pre>
    </li>
    <li>Execute a aplicação:
        <pre><code>npm run dev</code></pre>
    </li>
    <li>A aplicação estará rodando em <a href="http://localhost:3000">http://localhost:3000</a>.</li>
</ol>

<h2>Rotas</h2>
<ul>
    <li><code>POST /signin</code> - Realiza o login de um usuário, retornando tokens JWT e cookies.</li>
    <li><code>GET /auth</code> - Verifica se o usuário está autenticado usando o token de acesso. Se o token estiver expirado, tenta renovar com o refresh token.</li>
</ul>

<h2>Banco de Dados</h2>
<p>Crie uma tabela <code>users</code> no PostgreSQL com o seguinte esquema:</p>
<pre><code>CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);</code></pre>

<h2>Tecnologias</h2>
<ul>
    <li>Fastify</li>
    <li>jsonwebtoken</li>
    <li>bcryptjs</li>
    <li>pg</li>
</ul>
</body>
</html>