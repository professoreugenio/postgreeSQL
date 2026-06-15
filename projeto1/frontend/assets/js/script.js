const botaoTestarConexao = document.getElementById("btnTestarConexao");
const resultado = document.getElementById("resultado");

botaoTestarConexao.addEventListener("click", async () => {
    resultado.className = "alert alert-info mt-4";
    resultado.textContent = "Testando conexão com o banco de dados...";

    try {
        const resposta = await fetch("http://localhost:3000/api/teste/conexao");
        const dados = await resposta.json();

        if (dados.sucesso) {
            resultado.className = "alert alert-success mt-4";
            resultado.innerHTML = `
        <strong>Sucesso!</strong><br>
        ${dados.mensagem}<br>
        <small>Data retornada pelo banco: ${dados.data.data_atual}</small>
      `;
        } else {
            resultado.className = "alert alert-danger mt-4";
            resultado.textContent = dados.mensagem;
        }

    } catch (erro) {
        resultado.className = "alert alert-danger mt-4";
        resultado.innerHTML = `
      <strong>Erro ao acessar a API.</strong><br>
      Verifique se o servidor Node.js está rodando na porta 3000.
    `;
    }
});