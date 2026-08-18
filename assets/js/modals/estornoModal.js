// ==========================================
// MODAL DE ESTORNO - DASHBOARD
// ==========================================


// ==========================================
// ABRIR MODAL DE ESTORNO
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


    try {

        // ==========================================
        // ATUALIZAR CARTÕES
        // ==========================================

        await CartaoService.carregar();


        const cartoes =
            CartaoService.listar();


        // ==========================================
        // LIMPAR SELECT
        // ==========================================

        select.innerHTML = `
            <option value="">
                Selecione um cartão...
            </option>
        `;


        // ==========================================
        // ADICIONAR CARTÕES
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
// CONFIRMAR ESTORNO
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
    // CONFIRMAÇÃO
    // ==========================================

    const confirmar =
        confirm(
            "Deseja realmente estornar " +
            valor.toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            ) +
            " deste cartão?"
        );


    if (!confirmar) {

        return;

    }


    // ==========================================
    // ESTORNO DIRETO NO SUPABASE
    // ==========================================

    try {

        const {
            data,
            error
        } = await supabaseClient.rpc(
            "realizar_estorno",
            {
                p_cartao_id:
                    idCartao,

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


            return;

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
        // RECARREGAR CARTÕES
        // ==========================================

        await CartaoService.carregar();


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
        // ATUALIZAR TABELA
        // ==========================================

        if (
            typeof renderizarTabela ===
            "function"
        ) {

            renderizarTabela();

        }


    } catch (erro) {

        console.error(
            "Erro inesperado no estorno:",
            erro
        );


        toast(
            "Erro ao realizar estorno.",
            "error"
        );

    }

}