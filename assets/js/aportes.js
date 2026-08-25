// ==========================================
// APORTES E ESTORNOS
// ==========================================


// ==========================================
// CARTÃO SELECIONADO
// ==========================================

let cartaoSelecionado = null;


// ==========================================
// REALIZAR APORTE
// ==========================================

async function realizarAporte(
    idCartao,
    valor
) {

    valor = Number(valor);


    if (!idCartao) {

        toast(
            "Cartão não identificado.",
            "warning"
        );

        return false;

    }


    if (!valor || valor <= 0) {

        toast(
            "Informe um valor válido.",
            "warning"
        );

        return false;

    }


    try {

        const {
            data,
            error
        } = await supabaseClient.rpc(
            "realizar_aporte",
            {
                p_cartao_id:
                    Number(idCartao),

                p_valor:
                    valor,

                p_descricao:
                    "Aporte realizado"
            }
        );


        if (error) {

            console.error(
                "Erro no aporte:",
                error
            );


            toast(
                error.message ||
                "Não foi possível realizar o aporte.",
                "error"
            );


            return false;

        }


        console.log(
            "Aporte realizado:",
            data
        );


        toast(
            "Aporte realizado com sucesso.",
            "success"
        );


        await CartaoService.carregar();


        if (
            typeof renderizarTabela ===
            "function"
        ) {

            renderizarTabela();

        }


        return true;


    } catch (erro) {

        console.error(
            "Erro inesperado no aporte:",
            erro
        );


        toast(
            "Erro ao realizar aporte.",
            "error"
        );


        return false;

    }

}


// ==========================================
// ABRIR MODAL APORTE
// ==========================================

function abrirModalAporte(id) {

    cartaoSelecionado =
        Number(id);


    const campo =
        document.getElementById(
            "valorAporte"
        );


    if (campo) {

        campo.value = "";

    }


    abrirModal(
        "modalAporte"
    );

}


// ==========================================
// FECHAR MODAL APORTE
// ==========================================

function fecharModalAporte() {

    fecharModal(
        "modalAporte"
    );

}


// ==========================================
// CONFIRMAR APORTE
// ==========================================

async function confirmarAporte() {

    const campo =
        document.getElementById(
            "valorAporte"
        );


    const valor =
        Number(
            campo?.value
        );


    const sucesso =
        await realizarAporte(
            cartaoSelecionado,
            valor
        );


    if (!sucesso) {

        return;

    }


    fecharModalAporte();


    // ==========================================
    // ATUALIZAR DRAWER
    // ==========================================

    if (
        typeof abrirDrawer ===
        "function" &&
        cartaoSelecionado
    ) {

        abrirDrawer(
            cartaoSelecionado
        );

    }


    cartaoSelecionado = null;

}


// ==========================================
// ABRIR MODAL ESTORNO
// ==========================================

function abrirModalEstorno(id) {

    cartaoSelecionado =
        Number(id);


    const valor =
        document.getElementById(
            "valorEstorno"
        );


    const motivo =
        document.getElementById(
            "motivoEstorno"
        );


    if (valor) {

        valor.value = "";

    }


    if (motivo) {

        motivo.value = "";

    }


    abrirModal(
        "modalEstorno"
    );

}


// ==========================================
// FECHAR MODAL ESTORNO
// ==========================================

function fecharModalEstorno() {

    fecharModal(
        "modalEstorno"
    );

}


// ==========================================
// CONFIRMAR ESTORNO
// ==========================================

async function confirmarEstorno() {

    const valor =
        Number(
            document.getElementById(
                "valorEstorno"
            )?.value
        );


    const motivo =
        document.getElementById(
            "motivoEstorno"
        )?.value.trim();


    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (
        !valor ||
        valor <= 0
    ) {

        toast(
            "Informe um valor válido.",
            "warning"
        );

        return;

    }


    if (!cartaoSelecionado) {

        toast(
            "Cartão não identificado.",
            "error"
        );

        return;

    }


    if (!motivo) {

        toast(
            "Informe o motivo do estorno.",
            "warning"
        );

        return;

    }


    // ==========================================
    // REALIZAR ESTORNO NO SUPABASE
    // ==========================================

    try {

        const {
            data,
            error
        } = await supabaseClient.rpc(
            "realizar_estorno",
            {
                p_cartao_id:
                    Number(cartaoSelecionado),

                p_valor:
                    valor,

                p_motivo:
                    motivo
            }
        );


        // ==========================================
        // ERRO
        // ==========================================

        if (error) {

            console.error(
                "Erro no estorno:",
                error
            );


            toast(
                error.message ||
                "Não foi possível realizar o estorno.",
                "error"
            );


            return false;

        }


        console.log(
            "Estorno realizado:",
            data
        );


        // ==========================================
        // SUCESSO
        // ==========================================

        toast(
            "Estorno realizado com sucesso.",
            "success"
        );


        // ==========================================
        // RECARREGAR CARTÕES
        // ==========================================

        await CartaoService.carregar();


        // ==========================================
        // FECHAR MODAL
        // ==========================================

        fecharModalEstorno();


        // ==========================================
        // ATUALIZAR DRAWER
        // ==========================================

        if (
            typeof abrirDrawer ===
            "function"
        ) {

            abrirDrawer(
                cartaoSelecionado
            );

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


        // ==========================================
        // LIMPAR CARTÃO SELECIONADO
        // ==========================================

        cartaoSelecionado = null;


        return true;


    } catch (erro) {

        console.error(
            "Erro inesperado no estorno:",
            erro
        );


        toast(
            "Erro ao realizar estorno.",
            "error"
        );


        return false;

    }

}


// ==========================================
// ESTORNO PELO DASHBOARD
// ==========================================

async function abrirNovoEstorno() {

    const select =
        document.getElementById(
            "cartaoNovoEstorno"
        );


    if (!select) {

        toast(
            "Campo de cartão não encontrado.",
            "error"
        );

        return;

    }


    // ==========================================
    // LIMPAR OPÇÕES
    // ==========================================

    select.innerHTML = `
        <option value="">
            Selecione um cartão...
        </option>
    `;


    try {

        // ==========================================
        // ATUALIZAR CARTÕES
        // ==========================================

        await CartaoService.carregar();


        const cartoes =
            CartaoService.listar();


        // ==========================================
        // CARREGAR CARTÕES NO SELECT
        // ==========================================

        cartoes.forEach(cartao => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                cartao.id;


            option.textContent =
                `${cartao.funcionario} — Final ${cartao.final} — ${Number(
                    cartao.saldo || 0
                ).toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                )}`;


            select.appendChild(
                option
            );

        });


        // ==========================================
        // LIMPAR CAMPOS
        // ==========================================

        const valor =
            document.getElementById(
                "valorNovoEstorno"
            );


        const motivo =
            document.getElementById(
                "motivoNovoEstorno"
            );


        if (valor) {

            valor.value = "";

        }


        if (motivo) {

            motivo.value = "";

        }


        // ==========================================
        // ABRIR MODAL
        // ==========================================

        abrirModal(
            "modalNovoEstorno"
        );


    } catch (erro) {

        console.error(
            "Erro ao preparar estorno:",
            erro
        );


        toast(
            "Não foi possível carregar os cartões.",
            "error"
        );

    }

}


// ==========================================
// CONFIRMAR ESTORNO PELO DASHBOARD
// ==========================================

async function confirmarNovoEstorno() {

    const select =
        document.getElementById(
            "cartaoNovoEstorno"
        );


    const campoValor =
        document.getElementById(
            "valorNovoEstorno"
        );


    const campoMotivo =
        document.getElementById(
            "motivoNovoEstorno"
        );


    const idCartao =
        Number(
            select?.value
        );


    const valor =
        Number(
            campoValor?.value
        );


    const motivo =
        campoMotivo?.value.trim();


    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (!idCartao) {

        toast(
            "Selecione um cartão.",
            "warning"
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


    if (!motivo) {

        toast(
            "Informe o motivo do estorno.",
            "warning"
        );

        return;

    }


    // ==========================================
    // REALIZAR ESTORNO
    // ==========================================

    const sucesso =
        await realizarEstorno(
            idCartao,
            valor,
            motivo
        );


    if (!sucesso) {

        return;

    }


    // ==========================================
    // FECHAR MODAL
    // ==========================================

    fecharModal(
        "modalNovoEstorno"
    );


    // ==========================================
    // LIMPAR CAMPOS
    // ==========================================

    if (select) {

        select.value = "";

    }


    if (campoValor) {

        campoValor.value = "";

    }


    if (campoMotivo) {

        campoMotivo.value = "";

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


    // ==========================================
    // LIMPAR CARTÃO SELECIONADO
    // ==========================================

    cartaoSelecionado = null;


    return true;

}
// ==========================================
// NOVO APORTE — PLATAFORMA → CARTÃO
// ==========================================

async function abrirNovoAporte() {

    const select =
        document.getElementById("cartaoNovoAporte");

    if (!select) {

        console.error(
            "Campo cartaoNovoAporte não encontrado."
        );

        toast(
            "Campo de cartão não encontrado.",
            "error"
        );

        return;
    }

    // Limpar opções
    select.innerHTML = `
        <option value="">
            Selecione um cartão...
        </option>
    `;

    try {

        // Recarregar cartões
        await CartaoService.carregar();

        const cartoes =
            CartaoService.listar();

        // Preencher cartões
        cartoes.forEach(cartao => {

            const option =
                document.createElement("option");

            option.value =
                cartao.id;

            option.textContent =
                `${cartao.funcionario} — Final ${cartao.final} — ${Number(
                    cartao.saldo || 0
                ).toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                )}`;

            select.appendChild(option);

        });

        // Limpar valor
        const campoValor =
            document.getElementById(
                "valorNovoAporte"
            );

        if (campoValor) {
            campoValor.value = "";
        }

        // Abrir modal
        abrirModal(
            "modalNovoAporte"
        );

    } catch (erro) {

        console.error(
            "Erro ao preparar novo aporte:",
            erro
        );

        toast(
            "Não foi possível carregar os cartões.",
            "error"
        );

    }

}
// ==========================================
// APORTE DE SALDO — ENTRADA NA PLATAFORMA
// ==========================================

function abrirAporteSaldo() {

    const campoValor =
        document.getElementById("valorAporteSaldo");

    if (campoValor) {
        campoValor.value = "";
    }

    abrirModal("modalAporteSaldo");
}


function fecharAporteSaldo() {
    const modal = document.getElementById("modalAporteSaldo");

    if (modal) {
        modal.classList.remove("active");
    }
}