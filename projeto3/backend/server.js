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
app.get('/usuario/novo', (req, res) => {
    res.sendFile(path.join(caminhoFrontend, 'usuarionovo.html'));
});
// Rota produtos
app.get('/cliente/novo', (req, res) => {
    res.sendFile(path.join(caminhoFrontend, 'clientenovo.html'));
});



// Rota para abrir a página de novo produto
app.get('/produto/novo', (req, res) => {
    res.sendFile(path.join(caminhoFrontend, 'produtonovo.html'));
});



// Rota produtos
app.get('/produtos', (req, res) => {
    res.sendFile(path.join(caminhoFrontend, 'produtos.html'));
});

// Rota produtos
app.get('/produto/editar', (req, res) => {
    res.sendFile(path.join(caminhoFrontend, 'produtoeditar.html'));
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


// Cadastrar novo produto
app.post('/api/produtos', async (req, res) => {
    try {
        const { nome, preco, estoque, categoria } = req.body;

        // Validação básica
        if (!nome || preco === undefined || estoque === undefined) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nome, preço e estoque são obrigatórios.'
            });
        }

        const nomeLimpo = nome.trim();
        const categoriaLimpa = categoria ? categoria.trim() : null;
        const precoNumerico = Number(preco);
        const estoqueNumerico = Number(estoque);

        if (nomeLimpo.length < 2) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O nome do produto deve ter pelo menos 2 caracteres.'
            });
        }

        if (isNaN(precoNumerico) || precoNumerico < 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Informe um preço válido.'
            });
        }

        if (!Number.isInteger(estoqueNumerico) || estoqueNumerico < 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Informe um estoque válido.'
            });
        }

        const resultado = await pool.query(
            `
            INSERT INTO produtos 
                (nome, preco, estoque, categoria)
            VALUES 
                ($1, $2, $3, $4)
            RETURNING id, nome, preco, estoque, categoria
            `,
            [nomeLimpo, precoNumerico, estoqueNumerico, categoriaLimpa]
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Produto cadastrado com sucesso!',
            produto: resultado.rows[0]
        });

    } catch (erro) {
        console.error('Erro ao cadastrar produto:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cadastrar produto.',
            erro: erro.message
        });
    }
});


app.delete('/api/produtos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await pool.query(
            'DELETE FROM produtos WHERE id = $1 RETURNING *',
            [id]
        );

        if (resultado.rowCount === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado.'
            });
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Produto excluído com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao excluir produto:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao excluir produto.',
            erro: erro.message
        });
    }
});

// Buscar um produto pelo ID
app.get('/api/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            `
            SELECT 
                id,
                nome,
                preco,
                estoque,
                categoria
            FROM produtos
            WHERE id = $1
            `,
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado.'
            });
        }

        return res.status(200).json({
            sucesso: true,
            produto: resultado.rows[0]
        });

    } catch (erro) {
        console.error('Erro ao buscar produto:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar produto.',
            erro: erro.message
        });
    }
});


// Atualizar produto pelo ID
app.put('/api/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, preco, estoque, categoria } = req.body;

        if (!nome || preco === undefined || estoque === undefined || !categoria) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nome, preço, estoque e categoria são obrigatórios.'
            });
        }

        const nomeLimpo = nome.trim();
        const categoriaLimpa = categoria.trim();
        const precoNumerico = Number(preco);
        const estoqueNumerico = Number(estoque);

        if (nomeLimpo.length < 2) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O nome do produto deve ter pelo menos 2 caracteres.'
            });
        }

        if (isNaN(precoNumerico) || precoNumerico < 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Informe um preço válido.'
            });
        }

        if (!Number.isInteger(estoqueNumerico) || estoqueNumerico < 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Informe um estoque válido.'
            });
        }

        const resultado = await pool.query(
            `
            UPDATE produtos
            SET 
                nome = $1,
                preco = $2,
                estoque = $3,
                categoria = $4
            WHERE id = $5
            RETURNING id, nome, preco, estoque, categoria
            `,
            [nomeLimpo, precoNumerico, estoqueNumerico, categoriaLimpa, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado para atualização.'
            });
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Produto atualizado com sucesso!',
            produto: resultado.rows[0]
        });

    } catch (erro) {
        console.error('Erro ao atualizar produto:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar produto.',
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
