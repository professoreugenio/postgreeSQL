const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { pool } = require('./database/conexao');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const caminhoFrontend = path.join(__dirname, '..', 'frontend');

app.use(express.static(caminhoFrontend));

// rota para arquivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(caminhoFrontend, 'index.html'));
});

// Rota Usuários
app.get('/usuarios', (req, res) => {
    res.sendFile(path.join(caminhoFrontend, 'usuarios.html'));
});

// Rota Clientes
app.get('/clientes', (req, res) => {
    res.sendFile(path.join(caminhoFrontend, 'clientes.html'));
});


// rota para arquivo index.html

app.get('/teste', (req, res) => {
    res.json({
        mensagem: 'Rota teste funcionando!'
    });
});

app.get('/api/teste/conexao', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT NOW() AS data_atual, current_database() AS banco_atual'
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Conexão com PostgreSQL realizada com sucesso!',
            data: resultado.rows[0]
        });

    } catch (erro) {
        console.error('Erro ao conectar com PostgreSQL:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao conectar com PostgreSQL.',
            erro: erro.message
        });
    }
});

// Rota produtos
app.get('/produtos', (req, res) => {
    res.sendFile(path.join(caminhoFrontend, 'produtos.html'));
});



// consulta a tabela produtos

app.get('/api/produtos', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                id,
                nome,
                preco,
                estoque,
                categoria
            FROM produtos
            ORDER BY id ASC
        `);

        return res.status(200).json(resultado.rows);

    } catch (erro) {
        console.error('Erro ao listar produtos:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar produtos.',
            erro: erro.message
        });
    }
});

app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        mensagem: 'Rota não encontrada.'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});
