import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;

let listaUsuario = [];
let listaBatePapo = [];

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'MiNh4Ch4v3eS3cr3t4a4a',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 60 * 1000
    }
}));

app.use(cookieParser());

function usuarioEstaAutenticado(requisicao, resposta, next){
    if(requisicao.session.usuarioAutenticado){
        next();
    }
    else{
       resposta.redirect('/login.html');
    }
}

function cadastrarUsuario(requisicao, resposta){
    const nome = requisicao.body.nome;
    const dataNascimento = requisicao.body.dataNascimento;
    const nickname = requisicao.body.nickname;


    if (nome && dataNascimento && nickname) 
    {
        listaUsuario.push({
            nome: nome,
            dataNascimento: dataNascimento,
            nickname: nickname,
        });
        resposta.redirect('/listarUsuario');
    }
    else
    {
        resposta.write(`
 <!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Usuários</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container m-5">
        <h2>Cadastro de Usuários</h2>
        <form method="POST" action='/cadastrarUsuarios' class="border p-3 needs-validation" novalidate>
            <div class="mb-3">
                <label for="nome" class="form-label">Nome:</label>
                <input type="text" class="form-control" id="nome" name="nome" value"${nome}" required>`);
        if (nome == ""){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                            Por favor, informe o nome.
                        </div>
            `);
        }
        resposta.write(`</div>
            <div class="mb-3">
                <label for="dataNascimento" class="form-label">Data de Nascimento:</label>
                <input type="date" class="form-control" id="dataNascimento" name="dataNascimento" value"${dataNascimento}" required>`);
        if (dataNascimento == ""){
            resposta.write(`<div m-2 class="alert alert-danger" role="alert">
                                Por favor, informe a data de nascimento.
                            </div>`);
        }        
        resposta.write(`
   </div>
            <div class="mb-3">
                <label for="nickname" class="form-label">Nickname:</label>
                <input type="text" class="form-control" id="nickname" name="nickname" value"${nickname}" required>
        `);            
        if (nickname == ""){
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Por favor, informe o nickname.
                            </div>`);
        }       
        resposta.write(` </div>
            <button class="btn btn-primary" type="submit">Cadastrar Usuário</button>
            <a class="btn btn-secondary" href="/">Voltar</a>
        </form>
    </div>
</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
</html>
`);
        resposta.end();
    }
}


function autenticaUsuario(requisicao, resposta){
    const pessoa = requisicao.body.pessoa;
    const senha = requisicao.body.senha;
    if (pessoa == 'admin' && senha == '123456'){
        requisicao.session.usuarioAutenticado = true;
        resposta.cookie('dataUltimoAcesso', new Date().toLocaleString(),{
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
        resposta.redirect('/');
    }
    else{
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Falha ao realizar login</title>');
        resposta.write('<style>');
        resposta.write('body { font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }');
        resposta.write('.container { text-align: center; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }');
        resposta.write('h1 { color: #dc3545; margin-bottom: 20px; }');
        resposta.write('p { color: #6c757d; font-size: 16px; margin-bottom: 20px; }');
        resposta.write('a { text-decoration: none; color: #fff; background-color: #007bff; padding: 10px 20px; border-radius: 5px; font-size: 16px; }');
        resposta.write('a:hover { background-color: #0056b3; }');
        resposta.write('</style>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<div class="container">');
        resposta.write('<h1>Falha ao realizar login</h1>');
        resposta.write('<p>Usuário ou senha inválidos!</p>');
        resposta.write('<a href="/login.html">Voltar</a>');
        resposta.write('</div>');
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();

    }
}
app.post('/login',autenticaUsuario);

app.get('/login',(req,resp)=>{
    resp.redirect('/login.html');
});

app.get('/', (requisicao,resposta)=>{
    if (requisicao.cookies.dataUltimoAcesso) {
        resposta.write(`
                    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Menu - Sistema de Bate-Papo</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            .navbar {
                display: flex;
                justify-content: center;
                padding-left: 29rem;
            }
            .navbar-nav {
                flex-direction: row;
                gap: 15px;
            }
            .navbar-nav .nav-link {
                padding: 10px 15px;
            }
        </style>
    </head>
    <body class="bg-light">
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container-fluid">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">Início</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="cadastroUsuario.html">Cadastro de Usuários</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/batepapo">Bate-Papo</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/logout">Sair</a>
                    </li>
                </ul>
            </div>
        </nav>

        <div class="container mt-5 text-center">
            <h1 class="display-4 text-primary">Bem-vindo ao Sistema de Bate-Papo!</h1>
            <p class="lead text-secondary">Conecte-se e interaja com outras pessoas em tempo real.</p>
            <a href="/batepapo" style="background-color: blue;" class="btn btn-success btn-lg">Entrar no Bate-Papo</a>
        </div>

        <footer class="bg-primary text-white text-center py-3 mt-5">
            <div class="mt-4 text-center">
                <p><strong>Último Acesso:</strong> ${requisicao.cookies.dataUltimoAcesso}</p>
            </div>
            <p class="mb-0">&copy; 2024 Sistema de Bate-Papo. Todos os direitos reservados.</p>
        </footer>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>

        `);
    }
    resposta.end();
});

app.get('/logout', (req, resp) =>{
    req.session.destroy();
    resp.redirect('/login.html');
});

app.use(express.static(path.join(process.cwd(), 'publico')));

app.use(usuarioEstaAutenticado,express.static(path.join(process.cwd(), 'protegido')));

app.post('/cadastrarUsuarios', usuarioEstaAutenticado, cadastrarUsuario);

app.get('/listarUsuario', usuarioEstaAutenticado, (req, resp) => {

    resp.write(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lista de Usuários</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body class="bg-light">
            <div class="container mt-5">
                <h1 class="text-primary text-center">Lista de Usuários</h1>
                <table class="table table-striped table-hover mt-4">
                    <thead class="table-dark">
                        <tr>
                            <th>Nome</th>
                            <th>Data de Nascimento</th>
                            <th>Nickname</th>
                        </tr>
                    </thead>
                    <tbody id="tabelaUsuarios">
    `);

    for (let i = 0; i < listaUsuario.length; i++) {
        resp.write(`
            <tr>
                <td>${listaUsuario[i].nome}</td>
                <td>${new Date(listaUsuario[i].dataNascimento).toLocaleDateString('pt-BR')}</td>
                <td>${listaUsuario[i].nickname}</td>
            </tr>
        `);
    }
    

    resp.write(`
                    </tbody>
                </table>
                <div class="mt-4 text-center">
                    <a href="cadastroUsuario.html" class="btn btn-primary">Cadastrar Usuário</a>
                    <a href="/" class="btn btn-secondary">Voltar</a>
                </div>
    `);

    if (req.cookies.dataUltimoAcesso) {
        resp.write(`
                <div class="text-secondary mt-4 text-center">
                    <p>Seu último acesso foi em: <strong>${req.cookies.dataUltimoAcesso}</strong></p>
                </div>
        `);
    }

    resp.write(`
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </body>
        </html>
    `);
    resp.end();
});

app.get('/batepapo', usuarioEstaAutenticado, (req, res) => {
    res.write(`<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bate-Papo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .chat-box {
            height: 400px;
            overflow-y: scroll;
            border: 1px solid #ddd;
            padding: 15px;
            background-color: #f9f9f9;
        }
        .message {
            margin-bottom: 15px;
        }
        .message-user {
            font-weight: bold;
            color: #007bff;
        }
        .message-date {
            font-size: 0.8rem;
            color: #6c757d;
        }
    </style>
</head>
<body class="bg-light">
    <div class="container mt-5">
        <h1 class="text-center text-primary">Bate-Papo</h1>
        <div class="mb-4">
            <form id="chatForm" method="POST" action="/batepapo" class="row g-3">
                <div class="col-md-6">
                    <label for="usuario" class="form-label">Usuário:</label>
                    <select class="form-control" id="usuario" name="usuario" required>
                        <option value="">Selecione o usuário</option>`);
                        for (let i = 0; i < listaUsuario.length; i++) {
                            res.write(`
                                <option value="${listaUsuario[i].nome}">${listaUsuario[i].nome}</option>
                            `);
                        }
    res.write(`</select>
                </div>
                <div class="col-md-6">
                    <label for="mensagem" class="form-label">Mensagem:</label>
                    <input type="text" id="mensagem" name="mensagem" class="form-control" placeholder="Digite sua mensagem" required>
                </div>
                <input type="text" id="horarioMensagem" value="${new Date().toLocaleString()}" name="horarioMensagem" hidden>
                 <div class="col-12 button-group" style="">
                    <button type="submit" class="btn btn-primary">Enviar</button>
                    <a href="/" class="btn btn-secondary">Voltar</a>
                </div>
            </form>
        </div>

        <div class="chat-box" id="chatBox">
`);
    listaBatePapo.forEach(msg => {
        res.write(`
            <div class="message">
                <span class="message-user">${msg.usuario}:</span>
                <span>${msg.mensagem}</span>
                <div class="message-date">${msg.horarioMensagem}</div>
            </div>
        `);
    });
    res.write(`
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`);
    res.end();
});

app.post('/batepapo', usuarioEstaAutenticado, (req, res) => {
    const { usuario, mensagem } = req.body;
    const horarioMensagem = new Date().toLocaleString();

    if (usuario && mensagem) {
        listaBatePapo.push({ usuario, mensagem, horarioMensagem });
    }

    res.redirect('/batepapo');
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})