const tabelaProdutos = document.getElementById('tabelaProdutos');
const mensagemProdutos = document.getElementById('mensagemProdutos');

function mostrarMensagem(texto, tipo = 'success') {
    if (!mensagemProdutos) {
        console.warn('Elemento #mensagemProdutos não encontrado no HTML.');
        return;
    }

    mensagemProdutos.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${texto}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
        </div>
    `;
}

async function listarProdutos() {
    try {
        const resposta = await fetch('http://localhost:3000/api/produtos', {
            cache: 'no-store'
        });

        if (!resposta.ok) {
            throw new Error('Erro ao buscar produtos na API.');
        }

        const produtos = await resposta.json();

        tabelaProdutos.innerHTML = '';

        if (produtos.length === 0) {
            tabelaProdutos.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">
                        Nenhum produto cadastrado.
                    </td>
                </tr>
            `;
            return;
        }

        produtos.forEach((produto, indice) => {
            tabelaProdutos.innerHTML += `
                <tr id="produto-${produto.id}">
                    <td>${indice + 1}</td>
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>R$ ${Number(produto.preco).toFixed(2)}</td>
                    <td>${produto.estoque}</td>
                    <td>${produto.categoria ?? ''}</td>
                    <td>
                        <a 
                            href="/produto/editar?id=${produto.id}" 
                            class="btn btn-warning btn-sm">
                            Editar
                        </a>

                        <button 
                            class="btn btn-danger btn-sm"
                            onclick="excluirProduto(${produto.id})">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        console.error('Erro ao listar produtos:', erro);

        tabelaProdutos.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    Erro ao carregar produtos.
                </td>
            </tr>
        `;

        mostrarMensagem('Erro ao carregar produtos. Verifique se a API está ligada.', 'danger');
    }
}

async function excluirProduto(id) {
    const confirmar = confirm('Deseja realmente excluir este produto?');

    if (!confirmar) {
        mostrarMensagem('Exclusão cancelada pelo usuário.', 'warning');
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:3000/api/produtos/${id}`, {
            method: 'DELETE'
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || 'Erro ao excluir produto.');
        }

        mostrarMensagem(resultado.mensagem || 'Produto excluído com sucesso!', 'success');

        // Atualiza a tabela automaticamente após excluir
        await listarProdutos();

    } catch (erro) {
        console.error('Erro ao excluir produto:', erro);
        mostrarMensagem('Erro ao excluir produto.', 'danger');
    }
}

listarProdutos();