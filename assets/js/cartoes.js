// ==========================================
// ADICIONAR CARTÃO
// ==========================================

async function adicionarCartao(dados) {

    const cartao = await CartaoService.adicionar(dados);

    if (!cartao) {

        toast(
            "Não foi possível cadastrar o cartão.",
            "error"
        );

        return;

    }

    renderizarTabela();

}
// ==========================================
// ALTERAR STATUS DO CARTÃO
// ==========================================

async function alterarStatusCartao(id, novoStatus) {

    const status = String(novoStatus || "").toLowerCase();

    // ==========================================
    // VALIDAR STATUS
    // ==========================================

    if (!["ativo", "inativo"].includes(status)) {

        toast(
            "Status inválido.",
            "error"
        );

        return;
    }


    // ==========================================
    // BUSCAR CARTÃO
    // ==========================================

    const cartao = CartaoService.buscar(id);

    if (!cartao) {

        toast(
            "Cartão não encontrado.",
            "error"
        );

        return;
    }


    // ==========================================
    // VERIFICAR AÇÃO
    // ==========================================

    const vaiInativar =
        status === "inativo";


    // ==========================================
    // CONFIRMAÇÃO
    // ==========================================

    const confirmar = confirm(

        vaiInativar

            ? `Deseja realmente inativar o cartão de ${cartao.funcionario}?\n\nO cartão continuará cadastrado, mas não poderá ser utilizado para novos lançamentos.`

            : `Deseja realmente reativar o cartão de ${cartao.funcionario}?`

    );


    if (!confirmar) {
        return;
    }


    // ==========================================
    // ALTERAR NO SUPABASE
    // ==========================================

    try {

        const {
            data,
            error
        } = await supabaseClient.rpc(
            "alterar_status_cartao",
            {
                p_cartao_id: Number(id),
                p_status: status
            }
        );


        // ==========================================
        // TRATAR ERRO
        // ==========================================

        if (error) {

            console.error(
                "Erro ao alterar status do cartão:",
                error
            );


            toast(
                error.message ||
                "Não foi possível alterar o status do cartão.",
                "error"
            );

            return;
        }


        // ==========================================
        // LOG
        // ==========================================

        console.log(
            "Status do cartão alterado:",
            data
        );


        // ==========================================
        // RECARREGAR CARTÕES
        // ==========================================

        const carregou =
            await CartaoService.carregar();


        if (!carregou) {

            toast(
                "Status alterado, mas não foi possível atualizar a tabela.",
                "warning"
            );

            return;
        }


        // ==========================================
        // ATUALIZAR TABELA
        // ==========================================

        renderizarTabela();


        // ==========================================
        // MENSAGEM
        // ==========================================

        toast(

            vaiInativar

                ? "Cartão inativado com sucesso."

                : "Cartão ativado com sucesso.",

            "success"

        );

    }

    catch (erro) {

        console.error(
            "Erro inesperado ao alterar status:",
            erro
        );


        toast(
            "Erro inesperado ao alterar o status do cartão.",
            "error"
        );

    }

}

// ==========================================
// RENDERIZAR TABELA
// ==========================================

function renderizarTabela() {

    const tbody =
        document.getElementById("tbody-cartoes");

    if (!tbody) return;


    tbody.innerHTML = "";


    const cartoes =
        CartaoService.listar();


    if (cartoes.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="6" class="empty">

                    <div class="empty-state">

                        <div class="empty-icon">
                            💳
                        </div>

                        <h3>
                            Nenhum cartão cadastrado
                        </h3>

                        <p>
                            Clique em "Novo Cartão" para começar.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    cartoes.forEach(cartao => {

        tbody.innerHTML += `

            <tr>

                <td>
                    ${cartao.funcionario}
                </td>

                <td>
                    ${cartao.final}
                </td>

                <td>
                    ${cartao.centroCusto || "-"}
                </td>

                <td>

                    ${Number(cartao.saldo || 0).toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL"
                        }
                    )}

                </td>

                <td>

                    <span class="badge ${
                        String(cartao.status || "").toLowerCase() === "inativo"
                            ? "badge-danger"
                            : "badge-success"
                    }">

                        ${
                            String(cartao.status || "").toLowerCase() === "inativo"
                                ? "Inativo"
                                : "Ativo"
                        }

                    </span>

                </td>

                <td class="acoes-cartoes">

                    <!-- VISUALIZAR -->
                    <button
                        class="btn-visualizar btn-icon"
                        onclick="abrirDrawer(${cartao.id})"
                        title="Visualizar">
                        👁
                    </button>

                    <!-- ATIVAR / INATIVAR -->
                    <button
                        class="btn-inativar btn-icon"
                        onclick="alterarStatusCartao(
                            ${cartao.id},
                            '${String(cartao.status || "").toLowerCase() === "inativo"
                                ? "ativo"
                                : "inativo"}'
                        )"
                        title="${String(cartao.status || "").toLowerCase() === "inativo"
                                ? "Ativar cartão"
                                : "Inativar cartão"
                            }">

                        ${String(cartao.status || "").toLowerCase() === "inativo"
                                ? "🟢"
                                : "⛔"
                            }

                    </button>

                    <!-- EXCLUIR -->
                    <button
                        class="btn-excluir btn-icon danger"
                        onclick="removerCartao(${cartao.id})"
                        title="Excluir">
                        🗑
                    </button>

                </td>

            </tr>

        `;

    });

}


// ==========================================
// CARREGAR PÁGINA
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    if (!document.getElementById("tbody-cartoes")) {
        return;
    }


    // ==========================================
    // CARREGAR CARTÕES DO SUPABASE
    // ==========================================

    const carregou =
        await CartaoService.carregar();


    if (!carregou) {

        toast(
            "Não foi possível carregar os cartões.",
            "error"
        );

        return;

    }


    // ==========================================
    // RENDERIZAR TABELA
    // ==========================================

    renderizarTabela();

});

// ==========================================
// MODAL
// ==========================================

function abrirModalCartao() {

    abrirModal("modalCartao");

}


function fecharModalCartao() {

    fecharModal("modalCartao");

}


// ==========================================
// SALVAR CARTÃO
// ==========================================

async function salvarCartao() {

    const funcionario =
        document.getElementById("funcionario")
            ?.value
            .trim();


    const final =
        document.getElementById("final")
            ?.value
            .trim();


    const centroCusto =
        document.getElementById("centroCusto")
            ?.value
            .trim();


    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (!funcionario) {

        toast(
            "Informe o funcionário.",
            "warning"
        );

        return;

    }


    if (!final) {

        toast(
            "Informe o final do cartão.",
            "warning"
        );

        return;

    }


    if (!centroCusto) {

        toast(
            "Informe o centro de custo.",
            "warning"
        );

        return;

    }


    // ==========================================
    // EDIÇÃO
    // ==========================================

    if (cartaoEditando) {

        const {
            data,
            error
        } = await supabaseClient.rpc(
            "editar_cartao",
            {
                p_id: Number(cartaoEditando),

                p_funcionario:
                    funcionario,

                p_final:
                    final,

                p_centro_custo:
                    centroCusto
            }
        );


        // ==========================================
        // ERRO
        // ==========================================

        if (error) {

            console.error(
                "Erro ao editar cartão:",
                error
            );


            toast(
                error.message ||
                "Não foi possível atualizar o cartão.",
                "error"
            );

            return;

        }


        // ==========================================
        // RECARREGAR DO SUPABASE
        // ==========================================

        await CartaoService.carregar();


        cartaoEditando = null;


        fecharModalCartao();


        renderizarTabela();


        toast(
            "Cartão atualizado com sucesso.",
            "success"
        );


        return;
    }


    // ==========================================
    // NOVO CARTÃO — SUPABASE
    // ==========================================

    const {
        data,
        error
    } = await supabaseClient.rpc(
        "criar_cartao",
        {
            p_funcionario: funcionario,
            p_final: final,
            p_centro_custo: centroCusto
        }
    );


    // ==========================================
    // TRATAR ERRO
    // ==========================================

    if (error) {

        console.error(
            "Erro ao cadastrar cartão:",
            error
        );


        toast(
            error.message ||
            "Não foi possível cadastrar o cartão.",
            "error"
        );

        return;

    }


    // ==========================================
    // RECARREGAR CARTÕES
    // ==========================================

    await CartaoService.carregar();


    // ==========================================
    // FINALIZAR
    // ==========================================

    fecharModalCartao();


    document.getElementById(
        "funcionario"
    ).value = "";


    document.getElementById(
        "final"
    ).value = "";


    document.getElementById(
        "centroCusto"
    ).value = "";


    renderizarTabela();


    toast(
        "Cartão cadastrado com sucesso.",
        "success"
    );

}

// ==========================================
// REMOVER CARTÃO
// ==========================================

async function removerCartao(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este cartão?"
        );


    if (!confirmar) {

        return;

    }


    // ==========================================
    // EXCLUIR NO SUPABASE
    // ==========================================

    const {
        data,
        error
    } = await supabaseClient.rpc(
        "excluir_cartao",
        {
            p_id: Number(id)
        }
    );


    // ==========================================
    // TRATAR ERRO
    // ==========================================

    if (error) {

        console.error(
            "Erro ao excluir cartão:",
            error
        );


        toast(
            error.message ||
            "Não foi possível excluir o cartão.",
            "error"
        );

        return;

    }


    // ==========================================
    // RECARREGAR CARTÕES
    // ==========================================

    await CartaoService.carregar();


    // ==========================================
    // ATUALIZAR TABELA
    // ==========================================

    renderizarTabela();


    toast(
        "Cartão excluído com sucesso.",
        "success"
    );

}

// ==========================================
// EDITAR CARTÃO
// ==========================================

let cartaoEditando = null;


function editarCartao(id) {

    const cartao =
        CartaoService.buscar(id);


    if (!cartao) {

        toast(
            "Cartão não encontrado.",
            "error"
        );

        return;

    }


    cartaoEditando = id;


    document.getElementById("funcionario").value =
        cartao.funcionario;


    document.getElementById("final").value =
        cartao.final;


    document.getElementById("centroCusto").value =
        cartao.centroCusto || "";


    abrirModalCartao();

}


// ==========================================
// DRAWER
// ==========================================

function abrirDrawer(id) {

    const cartao =
        CartaoService.buscar(id);


    if (!cartao) {

        toast(
            "Cartão não encontrado.",
            "error"
        );

        return;

    }
    // ==========================================
    // CONFIGURAR BOTÕES DO DRAWER
    // ==========================================

    const btnAporte =
        document.getElementById(
            "btnAporteDrawer"
        );

    if (btnAporte) {

        btnAporte.onclick = function () {

            abrirModalAporte(
                cartao.id
            );

        };

    }


    const btnEstorno =
        document.getElementById(
            "btnEstornoDrawer"
        );

    if (btnEstorno) {

        btnEstorno.onclick = function () {

            abrirModalEstorno(
                cartao.id
            );

        };

    }
    document.getElementById(
        "drawerFuncionario"
    ).innerHTML =
        cartao.funcionario;


    document.getElementById(
        "drawerFinal"
    ).innerHTML =
        "Final " + cartao.final;


    document.getElementById(
        "drawerSaldo"
    ).innerHTML =
        Number(cartao.saldo || 0).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    const elementoDespesasPendentes =
        document.getElementById(
            "drawerDespesasPendentes"
        );


    if (elementoDespesasPendentes) {

        elementoDespesasPendentes.innerHTML =
            Number(
                cartao.totalDespesasPendentes || 0
            ).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

    }

    document.getElementById(
        "drawerStatus"
    ).innerHTML =
        cartao.status;


    carregarExtrato(id);


    document
        .getElementById("drawerOverlay")
        .classList.add("show");


    document
        .getElementById("drawerCartao")
        .classList.add("show");

}


// ==========================================
// FECHAR DRAWER
// ==========================================

function fecharDrawer() {

    document
        .getElementById("drawerOverlay")
        .classList.remove("show");


    document
        .getElementById("drawerCartao")
        .classList.remove("show");

}


// ==========================================
// CARREGAR EXTRATO DO CARTÃO
// ==========================================

async function carregarExtrato(cartaoId) {

    const tbody =
        document.getElementById(
            "extratoCartao"
        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML = `
        <tr>
            <td colspan="3" class="empty">
                Carregando...
            </td>
        </tr>
    `;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("despesas")
            .select(`
                id,
                data,
                valor,
                descricao,
                categoria,
                status
            `)
            .eq(
                "cartao_id",
                cartaoId
            )
            .order(
                "data",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "Erro ao carregar despesas do cartão:",
                error
            );


            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="empty">
                        Erro ao carregar despesas.
                    </td>
                </tr>
            `;

            return;

        }


        if (
            !data ||
            data.length === 0
        ) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="empty">
                        Nenhuma despesa vinculada a este cartão.
                    </td>
                </tr>
            `;

            return;

        }


        tbody.innerHTML = "";


        data.forEach(despesa => {

            const valor =
                Number(
                    despesa.valor || 0
                ).toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                );


            const dataFormatada =
                despesa.data
                    ? new Date(
                        despesa.data
                    ).toLocaleDateString(
                        "pt-BR"
                    )
                    : "-";


            tbody.innerHTML += `
                <tr>

                    <td>
                        ${dataFormatada}
                    </td>

                    <td>

                        <strong>
                            ${despesa.descricao || "Despesa"}
                        </strong>

                        <br>

                        <small>
                            ${despesa.categoria || ""}
                        </small>

                        <br>

                        ${despesa.status === "Pendente"
                    ? `
                                    <span class="badge badge-warning">
                                        Pendente
                                    </span>

                                    <button
                                        class="btn-icon"
                                        onclick="marcarDespesaComoPaga(${despesa.id})"
                                        title="Marcar como paga">

                                        ✓

                                    </button>
                                `
                    : `
                                    <span class="badge badge-success">
                                        Paga
                                    </span>
                                `
                }

                    </td>

                    <td>
                        ${valor}
                    </td>

                </tr>
            `;

        });


    } catch (erro) {

        console.error(
            "Erro inesperado ao carregar extrato:",
            erro
        );


        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="empty">
                    Erro ao carregar despesas.
                </td>
            </tr>
        `;

    }

}
async function confirmarNovoAporte() {

    const campoValor =
        document.getElementById("valorAporte");

    const valor =
        Number(campoValor?.value);

    if (!cartaoSelecionado) {

        toast(
            "Cartão não identificado.",
            "error"
        );

        return;
    }

    if (!valor || valor <= 0) {

        toast(
            "Informe um valor válido.",
            "warning"
        );

        return;
    }

    const sucesso =
        await realizarAporte(
            cartaoSelecionado,
            valor
        );

    if (!sucesso) {
        return;
    }

    fecharModal("modalAporte");

    if (typeof CartaoService !== "undefined") {
        await CartaoService.carregar();
    }

    if (typeof renderizarTabela === "function") {
        renderizarTabela();
    }

    toast(
        "Aporte realizado com sucesso.",
        "success"
    );
}
// ==========================================
// MARCAR DESPESA COMO PAGA
// ==========================================

async function marcarDespesaComoPaga(id) {

    const confirmar =
        confirm(
            "Deseja marcar esta despesa como paga?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("despesas")
            .update({
                status: "Paga"
            })
            .eq("id", id)
            .select("cartao_id")
            .single();


        if (error) {

            console.error(
                "Erro ao marcar despesa como paga:",
                error
            );


            toast(
                "Não foi possível atualizar a despesa.",
                "error"
            );


            return;

        }


        const cartaoId =
            data?.cartao_id;


        toast(
            "Despesa marcada como paga.",
            "success"
        );


        // ==========================================
        // RECARREGAR CARTÕES
        // ==========================================

        if (
            typeof CartaoService !==
            "undefined"
        ) {

            await CartaoService.carregar();

        }


        // ==========================================
        // ATUALIZAR EXTRATO
        // ==========================================

        if (cartaoId) {

            await carregarExtrato(
                cartaoId
            );


            const cartao =
                CartaoService.buscar(
                    cartaoId
                );


            if (cartao) {

                const elementoSaldo =
                    document.getElementById(
                        "drawerSaldo"
                    );


                if (elementoSaldo) {

                    elementoSaldo.textContent =
                        Number(
                            cartao.saldo || 0
                        ).toLocaleString(
                            "pt-BR",
                            {
                                style: "currency",
                                currency: "BRL"
                            }
                        );

                }


                const elementoPendentes =
                    document.getElementById(
                        "drawerDespesasPendentes"
                    );


                if (elementoPendentes) {

                    elementoPendentes.textContent =
                        Number(
                            cartao.totalDespesasPendentes || 0
                        ).toLocaleString(
                            "pt-BR",
                            {
                                style: "currency",
                                currency: "BRL"
                            }
                        );

                }

            }

        }


        // ==========================================
        // ATUALIZAR DASHBOARD
        // ==========================================

        if (
            typeof atualizarDashboardFinanceiro ===
            "function"
        ) {

            await atualizarDashboardFinanceiro();

        }

    } catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );


        toast(
            "Erro ao atualizar despesa.",
            "error"
        );

    }

}