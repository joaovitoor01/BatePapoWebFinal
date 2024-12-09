import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;

let listaInteressado = [];
let listaPet = [];
let listaAdotar = [];


const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'MinH4Ch4v3S3cr3t4',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30
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
                <label for="nickname" class="form-label">Telefone:</label>
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


function batePapo(requisicao, resposta){
    const usuario = requisicao.body.usuario;
    const mensagem = requisicao.body.mensagem;
    const horarioMensagem = requisicao.body.horarioMensagem;

    if (usuario && mensagem && horarioMensagem) 
    {
        listaBatePapo.push({
            usuario: usuario,
            mensagem: mensagem,
            horarioMensagem: horarioMensagem
        });
        resposta.redirect('/listarBatePapo');
    }
    else
    {
        resposta.write(`
 <!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bate-Papo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container m-5">
        <h2>Bate-Papo</h2>
        <form method="POST" action='/batepapo' class="border p-3 needs-validation" novalidate>
            <div class="mb-3">
                <label class="form-label">Enviar Mensagem:</label><br>
                <label for="usuario" class="form-label">Usuário:</label>
                <input class="form-select" id="usuario" name="usuario" value"${usuario}" required>`);

        if (usuario == ""){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                            Por favor, informe o usuario.
                        </div>
            `);
        }
        resposta.write(`
            </div>
            <div class="mb-3">
                <label for="mensagem" class="form-label">Mensagem:</label>
                <input class="form-select" id="mensagem" name="mensagem" value"${mensagem}" required>`);

        if (pet == ""){
            resposta.write(`<div m-2 class="alert alert-danger" role="alert">
                                Por favor, informe uma mensagem a ser postada.
                            </div>`);
        }        

        resposta.write(`
            </div>
            <input type="text" id="horarioMensagem" value="${requisicao.cookies.horarioMensagem}" name="horarioMensagem" hidden>
            <button class="btn btn-primary" type="submit">Enviar</button>
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
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Usuário ou senha inválidos!</p>');
        resposta.write('<a href="/login.html">Voltar</a>');
        if (requisicao.cookies.dataUltimoAcesso){
            resposta.write('<p>');
            resposta.write('Seu último acesso foi em ' + requisicao.cookies.dataUltimoAcesso);
            resposta.write('</p>');
        }
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
}
app.post('/login',autenticaUsuario);

app.get('/login',(req,resp)=>{
    resp.redirect('/login.html');
});

app.get('/logout', (req, resp) =>{
    req.session.destroy();
    resp.redirect('/login.html');
});

app.use(express.static(path.join(process.cwd(), 'publico')));

app.use(usuarioEstaAutenticado,express.static(path.join(process.cwd(), 'protegido')));

app.post('/cadastrarUsuario', usuarioEstaAutenticado, cadastrarUsuario);

app.post('/batepapo', usuarioEstaAutenticado, batePapo);


app.get('/listarUsuario', usuarioEstaAutenticado, (req,resp)=>{
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<title>Resultado do cadastro de usuário:</title>');
    resp.write('<meta charset="utf-8">');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">')
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<h1>Lista de Usuários:</h1>');
    resp.write('<table class="table table-striped">');
    resp.write('<tr>');
    resp.write('<th>Nome</th>');
    resp.write('<th>Data de Nascimento</th>');
    resp.write('<th>Nickname</th>');
    resp.write('</tr>');
    for (let i=0; i<listaUsuario.length; i++){
        resp.write('<tr>');
        resp.write(`<td>${listaUsuario[i].nome}`);
        resp.write(`<td>${listaUsuario[i].dataNascimento}`);
        resp.write(`<td>${listaUsuario[i].nickname}`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('<a href="/">Voltar</a>');
    resp.write('<br/>');

    if(req.cookies.dataUltimoAcesso){
        resp.write('<p>');
        resp.write('Seu último acesso foi em ' + req.cookies.dataUltimoAcesso);
        resp.write('</p>');
    }
    resp.write('</body>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>')
    resp.write('</html>');
    resp.end();
});



app.get('/batepapo',  usuarioEstaAutenticado, batePapo, (req,resp)=>{
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<title>Bate-Papo</title>');
    resp.write('<meta charset="utf-8">');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">')
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<h1>ate-Papo</h1>');
    resp.write('<table class="table table-striped">');
    resp.write('<tr>');
    resp.write('<th>Interessado</th>');
    resp.write('<th>Pet</th>');
    resp.write('</tr>');
    for (let i=0; i<listaBatePapo.length; i++){
        resp.write('<tr>');
        resp.write(`<td>${listaBatePapo[i].usuario}`);
        resp.write(`<td>${listaBatePapo[i].mensagem}`);
        resp.write(`<td>${listaBatePapo[i].dataUltimoAcesso}`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('<a href="/">Voltar</a>');
    resp.write('<br/>');
    resp.write('</body>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>')
    resp.write('</html>');
    resp.end();
});

app.post('/batepapo', usuarioEstaAutenticado, batePapo);

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})