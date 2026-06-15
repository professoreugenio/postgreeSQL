const express = require("express");
const router = express.Router();
const pool = require("../config/database");

router.get("/conexao", async (req, res) => {
    try {
        const resultado = await pool.query("SELECT NOW() AS data_atual");

        res.json({
            sucesso: true,
            mensagem: "Conexão com PostgreSQL realizada com sucesso!",
            data: resultado.rows[0]
        });

    } catch (erro) {
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao conectar com o banco de dados.",
            erro: erro.message
        });
    }
});

module.exports = router;