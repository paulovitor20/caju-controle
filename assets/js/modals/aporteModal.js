// ==========================================
// NOVO APORTE
// ==========================================

async function abrirNovoAporte() {

    const select =
        document.getElementById("cartaoNovoAporte");

    if (!select) return;


    // Limpa o select
    select.innerHTML = `
        <option value="">
            Carregando cartões...
        </option>
    `;


    // ==========================================
    // CARREGAR CARTÕES DO SUPABASE
    // ==========================================

    const carregou =
        await CartaoService.carregar();


    if (!carregou) {

        select.innerHTML = `
            <option value="">
                Não foi possível carregar os cartões
            </option>
        `;

        toast(
            "Não foi possível carregar os cartões.",
            "error"
        );

        return;

    }


    const cartoes =
        CartaoService.listar();


    // ==========================================
    // NENHUM CARTÃO
    // ==========================================

    if (!cartoes.length) {

        select.innerHTML = `
            <option value="">
                Nenhum cartão cadastrado
            </option>
        `;

        toast(
            "Nenhum cartão cadastrado.",
            "warning"
        );

        return;

    }


    // ==========================================
    // PREENCHER CARTÕES
    // ==========================================

    select.innerHTML = `
        <option value="">
            Selecione um cartão...
        </option>
    `;


    cartoes.forEach(cartao => {

        const option =
            document.createElement("option");


        option.value =
            cartao.id;


        option.textContent =
            `${cartao.funcionario} • Final ${cartao.final} • ${
                Number(cartao.saldo || 0).toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                )
            }`;


        select.appendChild(option);

    });


    // ==========================================
    // LIMPAR VALOR
    // ==========================================

    const campoValor =
        document.getElementById("valorNovoAporte");


    if (campoValor) {

        campoValor.value = "";

    }


    // ==========================================
    // ABRIR MODAL
    // ==========================================

    abrirModal("modalNovoAporte");

}


// ==========================================
// CONFIRMAR APORTE
// ==========================================

async function confirmarNovoAporte() {

    const select =
        document.getElementById("cartaoNovoAporte");


    const campoValor =
        document.getElementById("valorNovoAporte");


    const idCartao =
        select?.value;


    const valor =
        Number(campoValor?.value);


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


    await realizarAporte(
        Number(idCartao),
        valor
    );

}