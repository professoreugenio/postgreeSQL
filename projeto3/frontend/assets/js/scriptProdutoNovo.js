const formProdutoNovo = document.getElementById('formProdutoNovo');
const mensagemProduto = document.getElementById('mensagemProduto');

formProdutoNovo.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const preco = document.getElementById('preco').value;
    const estoque = document.getElementById('estoque').value;
    const categoria = document.getElementById('categoria').value.trim();

    mensagemProduto.innerHTML = `
        <div class="alert alert-info">
            Salvando produto...
        </div>
    `;

    try {
        const resposta = await fetch('/api/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                preco,
                estoque,
                categoria
            })
        });

        const dados = await resposta.json();

        if (dados.sucesso) {
            mensagemProduto.innerHTML = `
                <div class="alert alert-success">
                    <strong>Sucesso!</strong> ${dados.mensagem}
                </div>
            `;

            formProdutoNovo.reset();

        } else {
            mensagemProduto.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Atenção!</strong> ${dados.mensagem}
                </div>
            `;
        }

    } catch (erro) {
        console.error('Erro ao cadastrar produto:', erro);

        mensagemProduto.innerHTML = `
            <div class="alert alert-danger">
                Erro ao conectar com o servidor. Verifique se o Node.js está rodando.
            </div>
        `;
    }
});