const formProdutoEditar = document.getElementById('formProdutoEditar');
const mensagemProduto = document.getElementById('mensagemProduto');

const inputIdProduto = document.getElementById('idProduto');
const inputNome = document.getElementById('nome');
const inputPreco = document.getElementById('preco');
const inputEstoque = document.getElementById('estoque');
const inputCategoria = document.getElementById('categoria');

// Pega o ID que veio na URL: produtoeditar.html?id=3
const parametrosUrl = new URLSearchParams(window.location.search);
const idProduto = parametrosUrl.get('id');

function mostrarMensagem(tipo, texto) {
    mensagemProduto.innerHTML = `
        <div class="alert alert-${tipo}">
            ${texto}
        </div>
    `;
}

async function carregarProduto() {
    if (!idProduto) {
        mostrarMensagem('danger', 'ID do produto não informado na URL.');
        formProdutoEditar.style.display = 'none';
        return;
    }

    try {
        mostrarMensagem('info', 'Carregando dados do produto...');

        const resposta = await fetch(`/api/produtos/${idProduto}`);
        const dados = await resposta.json();

        if (!dados.sucesso) {
            mostrarMensagem('danger', dados.mensagem);
            formProdutoEditar.style.display = 'none';
            return;
        }

        const produto = dados.produto;

        inputIdProduto.value = produto.id;
        inputNome.value = produto.nome;
        inputPreco.value = Number(produto.preco).toFixed(2);
        inputEstoque.value = produto.estoque;
        inputCategoria.value = produto.categoria;

        mensagemProduto.innerHTML = '';

    } catch (erro) {
        console.error('Erro ao carregar produto:', erro);

        mostrarMensagem(
            'danger',
            'Erro ao carregar produto. Verifique se o servidor está rodando.'
        );

        formProdutoEditar.style.display = 'none';
    }
}

formProdutoEditar.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const nome = inputNome.value.trim();
    const preco = inputPreco.value;
    const estoque = inputEstoque.value;
    const categoria = inputCategoria.value.trim();

    try {
        mostrarMensagem('info', 'Atualizando produto...');

        const resposta = await fetch(`/api/produtos/${idProduto}`, {
            method: 'PUT',
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
            mostrarMensagem('success', dados.mensagem);

            setTimeout(() => {
                window.location.href = '/produtos';
            }, 1200);

        } else {
            mostrarMensagem('danger', dados.mensagem);
        }

    } catch (erro) {
        console.error('Erro ao atualizar produto:', erro);

        mostrarMensagem(
            'danger',
            'Erro ao atualizar produto. Verifique a conexão com o servidor.'
        );
    }
});

carregarProduto();