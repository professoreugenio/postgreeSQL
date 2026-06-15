const btnTestarConexao = document.getElementById('btnTestarConexao');
const resultado = document.getElementById('resultado');

btnTestarConexao.addEventListener('click', async () => {
    resultado.innerHTML = `
    <div class="alert alert-info">
      Testando conexão com o banco de dados...
    </div>
  `;

    try {
        const resposta = await fetch('/api/teste/conexao');
        const dados = await resposta.json();

        if (dados.sucesso) {
            resultado.innerHTML = `
        <div class="alert alert-success">
          <strong>Sucesso!</strong> ${dados.mensagem}
        </div>

        <pre class="bg-light border rounded p-3">${JSON.stringify(dados, null, 2)}</pre>
      `;
        } else {
            resultado.innerHTML = `
        <div class="alert alert-danger">
          <strong>Erro!</strong> ${dados.mensagem}
        </div>

        <pre class="bg-light border rounded p-3">${JSON.stringify(dados, null, 2)}</pre>
      `;
        }

    } catch (erro) {
        resultado.innerHTML = `
      <div class="alert alert-danger">
        Não foi possível acessar a API. Verifique se o servidor está rodando.
      </div>

      <pre class="bg-light border rounded p-3">${erro.message}</pre>
    `;
    }
});
