function abrirNovaDespesa() {

    document.getElementById(
        "fornecedorNovaDespesa"
    ).value = "";

    document.getElementById(
        "categoriaNovaDespesa"
    ).value = "";

    document.getElementById(
        "centroCustoNovaDespesa"
    ).value = "";

    document.getElementById(
        "cartaoNovaDespesa"
    ).value = "";

    document.getElementById(
        "valorNovaDespesa"
    ).value = "";

    document.getElementById(
        "descricaoNovaDespesa"
    ).value = "";

    carregarCartoesNovaDespesa();

    abrirModal(
        "modalNovaDespesa"
    );

}

// ==========================================
// CARREGAR CARTÕES NO MODAL DE DESPESA
// ==========================================

function carregarCartoesNovaDespesa() {

    const select =
        document.getElementById(
            "cartaoNovaDespesa"
        );


    if (!select) {

        return;

    }


    select.innerHTML = `
        <option value="">
            Selecione um cartão...
        </option>
    `;


    if (
        typeof CartaoService ===
        "undefined"
    ) {

        return;

    }


    const cartoes =
        CartaoService.listar();


    cartoes.forEach(cartao => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            cartao.id;


        option.textContent =
            `${cartao.funcionario} — final ${cartao.final}`;


        select.appendChild(
            option
        );

    });

}
function fecharNovaDespesa() {

    fecharModal("modalNovaDespesa");

}


async function confirmarNovaDespesa() {
    const fornecedor =
        document.getElementById("fornecedorNovaDespesa").value.trim();
    const categoria =
        document.getElementById("categoriaNovaDespesa").value;
    const centroCusto =
        document.getElementById("centroCustoNovaDespesa").value;
    const cartaoId =
        document.getElementById("cartaoNovaDespesa").value;
    const valor =
        Number(document.getElementById("valorNovaDespesa").value);
    const descricao =
        document.getElementById("descricaoNovaDespesa").value.trim();
    if (!fornecedor) {

        toast("Informe o fornecedor.", "warning");

        return;

    }
    if (!categoria) {

        toast("Selecione uma categoria.", "warning");

        return;

    }
    if (!centroCusto) {

        toast("Selecione o centro de custo.", "warning");

        return;

    }
    if (!cartaoId) {

        toast(
            "Selecione o cartão da despesa.",
            "warning"
        );

        return;

    }
    if (!valor || valor <= 0) {

        toast("Informe um valor válido.", "warning");

        return;

    }
    if (!descricao) {

        toast("Informe a descrição da despesa.", "warning");

        return;

    }
    const despesa =
        await DespesaService.adicionar({

            fornecedor,
            categoria,
            centroCusto,
            cartaoId,
            valor,
            descricao,
            status: "Pendente"

        });

    if (!despesa) {

        toast("Não foi possível cadastrar a despesa.", "error");

        return;

    }

    toast(
        "Despesa cadastrada com sucesso.",
        "success"
    );


    if (
        typeof renderizarDespesas ===
        "function"
    ) {

        renderizarDespesas();

    }


    if (
        typeof atualizarDashboardFinanceiro ===
        "function"
    ) {

        await atualizarDashboardFinanceiro();

    }

    fecharNovaDespesa();


}