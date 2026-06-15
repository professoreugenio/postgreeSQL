const tabelaProdutos = document.getElementById('tabelaProdutos');

async function listarProdutos() {
    try {
        const resposta = await fetch('http://localhost:3000/api/produtos');
        const produtos = await resposta.json();

        tabelaProdutos.innerHTML = '';

        produtos.forEach((produto, indice) => {
            tabelaProdutos.innerHTML += `
                <tr>
                    <td>${indice + 1}</td>
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>R$ ${Number(produto.preco).toFixed(2)}</td>
                    <td>${produto.estoque}</td>
                    <td>${produto.categoria}</td>
                    <td>
                    <a
                    href="/produtoeditar.html?id=${produto.id}" 
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
    }
}

listarProdutos();