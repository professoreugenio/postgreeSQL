async function carregarNav() {
    const areaNav = document.getElementById('areaNav');

    if (!areaNav) {
        return;
    }

    try {
        const resposta = await fetch('/componentes/nav.html');

        if (!resposta.ok) {
            throw new Error('Erro ao carregar o menu.');
        }

        const html = await resposta.text();

        areaNav.innerHTML = html;

    } catch (erro) {
        console.error('Erro ao carregar nav:', erro);
    }
}

carregarNav();