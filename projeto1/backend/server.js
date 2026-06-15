const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Rota de teste da conexão
app.get("/api/teste/conexao", async (req, res) => {
    res.json({
        sucesso: true,
        mensagem: "Conexão com PostgreSQL realizada com sucesso!",
        data: {
            data_atual: new Date()
        }
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});