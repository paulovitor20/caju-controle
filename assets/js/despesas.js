function formatarMoeda(valor) {

    return Number(valor || 0).toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"

    });

}


function formatarData(data) {

    if (!data) return "-";

    return new Date(data).toLocaleDateString("pt-BR");

}


function renderizarDespesas() {

    const tbody =
        document.getElementById("tbody-despesas");

    if (!tbody) return;


    const pesquisa =
        document
            .getElementById("pesquisaDespesas")
            ?.value
            .toLowerCase()
            .trim() || "";


    const despesas =
        DespesaService.listar();


    const filtradas =
        despesas.filter(despesa => {

            return (

                despesa.fornecedor
                    ?.toLowerCase()
                    .includes(pesquisa)

                ||

                despesa.categoria
                    ?.toLowerCase()
                    .includes(pesquisa)

                ||

                despesa.descricao
                    ?.toLowerCase()
                    .includes(pesquisa)

            );

        });


    tbody.innerHTML = "";


    if (filtradas.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="8" class="empty">

                    <div class="empty-state">

                        <div class="empty-icon">
                            🧾
                        </div>

                        <h3>
                            Nenhuma despesa encontrada
                        </h3>

                        <p>
                            As despesas cadastradas aparecerão aqui.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        atualizarResumo([]);

        return;

    }


    filtradas.forEach(despesa => {

        let badgeClass =
            "badge badge-warning";


        if (despesa.status === "Paga") {

            badgeClass =
                "badge badge-success";

        }


        tbody.innerHTML += `

            <tr>

                <td>
                    ${formatarData(despesa.data)}
                </td>

                <td>
                    ${despesa.fornecedor || "-"}
                </td>

                <td>
                    ${despesa.categoria || "-"}
                </td>

                <td>
                    ${despesa.centroCusto || "-"}
                </td>

                <td>
                    ${despesa.descricao || "-"}
                </td>

                <td>
                    ${formatarMoeda(despesa.valor)}
                </td>

                <td>

                    <span class="${badgeClass}">
                        ${despesa.status}
                    </span>

                </td>

                <td>

                    <button
                        class="btn-icon"
                        title="Visualizar"
                        onclick="visualizarDespesa(${despesa.id})">

                        👁

                    </button>

                </td>

            </tr>

        `;

    });


    atualizarResumo(filtradas);

}


function atualizarResumo(despesas) {

    let total = 0;

    let pendentes = 0;

    let pagas = 0;


    despesas.forEach(despesa => {

        const valor =
            Number(despesa.valor) || 0;


        total += valor;


        if (despesa.status === "Paga") {

            pagas += valor;

        } else {

            pendentes += valor;

        }

    });


    document.getElementById("totalDespesas").textContent =
        formatarMoeda(total);


    document.getElementById("despesasPendentes").textContent =
        formatarMoeda(pendentes);


    document.getElementById("despesasPagas").textContent =
        formatarMoeda(pagas);


    document.getElementById("quantidadeDespesas").textContent =
        despesas.length;

}


function visualizarDespesa(id) {

    const despesa =
        DespesaService.buscar(id);


    if (!despesa) {

        toast(
            "Despesa não encontrada.",
            "error"
        );

        return;

    }


    alert(

        "Fornecedor: " +
        despesa.fornecedor +

        "\n\nCategoria: " +
        despesa.categoria +

        "\n\nCentro de Custo: " +
        despesa.centroCusto +

        "\n\nValor: " +
        formatarMoeda(despesa.valor) +

        "\n\nDescrição: " +
        despesa.descricao +

        "\n\nStatus: " +
        despesa.status

    );

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderizarDespesas();

    }
);