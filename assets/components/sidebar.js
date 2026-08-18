document.getElementById("sidebar").innerHTML = `

<div class="logo">
    <h2>CAJU CONTROL</h2>
</div>

<nav class="menu">

    <div class="menu-title">Principal</div>

    <a href="dashboard.html">
        Dashboard
    </a>

    <div class="menu-title">Financeiro</div>

    <a href="conta-caju.html">
        Conta CAJU
    </a>

    <a href="cartoes.html">
        Cartões
    </a>

    <a href="despesas.html">
        Despesas
    </a>

    <a href="movimentacoes.html">
        Movimentações
    </a>

    <a href="conciliacao.html">
        Conciliação
    </a>

    <div class="menu-title">Cadastros</div>

    <a href="funcionarios.html">
        Funcionários
    </a>

    <a href="centro-custo.html">
        Centros de Custo
    </a>

    <a href="categorias.html">
        Categorias
    </a>

    <a href="configuracoes.html">
        Configurações
    </a>

</nav>

`;

document.querySelectorAll(".menu a").forEach(link => {

    if (window.location.pathname.endsWith(link.getAttribute("href"))) {
        link.classList.add("active");
    }

});