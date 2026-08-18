// ==========================================
// CONTA CAJU
// ==========================================

let totalDespesasPendentes = 0;


const ContaCaju = {

    saldo: 0,


    // ==========================================
    // DEFINIR SALDO
    // ==========================================

    definirSaldo(valor) {

        this.saldo =
            Number(valor) || 0;

        atualizarSaldoConta();

    },


    // ==========================================
    // ATUALIZAR
    // ==========================================

    atualizar() {

        atualizarSaldoConta();

    }

};


// ==========================================
// ATUALIZAR SALDO NA TELA
// ==========================================

function atualizarSaldoConta() {

    const elemento =
        document.getElementById(
            "saldoConta"
        );


    if (!elemento) {

        return;

    }


    elemento.textContent =
        Number(
            ContaCaju.saldo || 0
        ).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


// ==========================================
// CARREGAR CONTA CAJU
// ==========================================

async function carregarContaCaju() {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("conta_caju")
            .select("*")
            .limit(1)
            .maybeSingle();


        if (error) {

            console.error(
                "Erro ao carregar Conta CAJU:",
                error
            );

            return false;

        }


        if (!data) {

            console.warn(
                "Nenhum registro encontrado em conta_caju."
            );

            ContaCaju.definirSaldo(0);

            return false;

        }


        const saldo =
            data.saldo ??
            data.valor ??
            data.saldo_atual ??
            0;


        ContaCaju.definirSaldo(
            saldo
        );


        return true;


    } catch (erro) {

        console.error(
            "Erro inesperado ao carregar Conta CAJU:",
            erro
        );

        return false;

    }

}


// ==========================================
// CARREGAR DESPESAS PENDENTES
// ==========================================

async function carregarDespesasPendentes() {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("despesas")
            .select("valor")
            .eq("status", "Pendente");


        if (error) {

            console.error(
                "Erro ao carregar despesas pendentes:",
                error
            );

            totalDespesasPendentes = 0;

            return false;

        }


        totalDespesasPendentes =
            (data || []).reduce(
                (soma, despesa) => {

                    return soma +
                        Number(
                            despesa.valor || 0
                        );

                },
                0
            );


        return true;


    } catch (erro) {

        console.error(
            "Erro inesperado ao carregar despesas:",
            erro
        );

        totalDespesasPendentes = 0;

        return false;

    }

}


// ==========================================
// ATUALIZAR CARDS DO DASHBOARD
// ==========================================

function atualizarCardsDashboard() {

    // ==========================================
    // CARTÕES
    // ==========================================

    const cartoes =
        typeof CartaoService !== "undefined"
            ? CartaoService.listar()
            : [];


    // ==========================================
    // SALDO TOTAL DOS CARTÕES
    // ==========================================

    const saldoTotalCartoes =
        cartoes.reduce(
            (total, cartao) => {

                return total +
                    Number(
                        cartao.saldo || 0
                    );

            },
            0
        );


    // ==========================================
    // CARD — SALDO TOTAL CARTÕES
    // ==========================================

    const elementoCartoes =
        document.getElementById(
            "saldoTotalCartoes"
        );


    if (elementoCartoes) {

        elementoCartoes.textContent =
            saldoTotalCartoes.toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

    }


    // ==========================================
    // CARD — DESPESAS PENDENTES
    // ==========================================

    const elementoDespesas =
        document.getElementById(
            "despesasPendentes"
        );


    if (elementoDespesas) {

        elementoDespesas.textContent =
            Number(
                totalDespesasPendentes || 0
            ).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

    }


    // ==========================================
    // DIFERENÇA
    // ==========================================

    const diferenca =
        Number(
            ContaCaju.saldo || 0
        ) -
        saldoTotalCartoes -
        Number(
            totalDespesasPendentes || 0
        );


    const elementoDiferenca =
        document.getElementById(
            "diferencaSaldo"
        );


    if (elementoDiferenca) {

        elementoDiferenca.textContent =
            diferenca.toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

    }

    // ==========================================
    // PAINÉIS DO DASHBOARD
    // ==========================================

    carregarUltimasMovimentacoes();

    carregarCartoesMenorSaldo();

}


// ==========================================
// ATUALIZAR DASHBOARD FINANCEIRO
// ==========================================

async function atualizarDashboardFinanceiro() {

    // Cartões
    if (
        typeof CartaoService !==
        "undefined"
    ) {

        await CartaoService.carregar();

    }


    // Conta CAJU
    await carregarContaCaju();


    // Despesas
    await carregarDespesasPendentes();


    // Cards
    atualizarCardsDashboard();

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            console.error(
                "supabaseClient não está disponível."
            );

            return;

        }


        await atualizarDashboardFinanceiro();

    }
);
// ==========================================
// ÚLTIMAS MOVIMENTAÇÕES
// ==========================================

async function carregarUltimasMovimentacoes() {

    const tbody =
        document.getElementById(
            "tbodyUltimasMovimentacoes"
        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML = `
        <tr>
            <td colspan="4" class="empty">
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
                status,
                cartao_id
            `)
            .order(
                "data",
                {
                    ascending: false
                }
            )
            .limit(5);


        if (error) {

            console.error(
                "Erro ao carregar últimas movimentações:",
                error
            );


            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty">
                        Erro ao carregar movimentações.
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
                    <td colspan="4">

                        <div class="empty-state">

                            <div class="empty-icon">
                                📄
                            </div>

                            <h3>
                                Nenhuma movimentação encontrada
                            </h3>

                            <p>
                                Quando houver lançamentos eles aparecerão aqui.
                            </p>

                        </div>

                    </td>
                </tr>
            `;

            return;

        }


        const cartoes =
            typeof CartaoService !== "undefined"
                ? CartaoService.listar()
                : [];


        tbody.innerHTML = "";


        data.forEach(despesa => {

            const cartao =
                cartoes.find(
                    c =>
                        String(c.id) ===
                        String(despesa.cartao_id)
                );


            const funcionario =
                cartao?.funcionario ||
                "Cartão";


            const dataFormatada =
                despesa.data
                    ? new Date(
                        despesa.data
                    ).toLocaleDateString(
                        "pt-BR"
                    )
                    : "-";


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


            tbody.innerHTML += `
                <tr>

                    <td>
                        ${dataFormatada}
                    </td>

                    <td>
                        <strong>
                            ${funcionario}
                        </strong>
                    </td>

                    <td>

                        <span class="badge badge-warning">
                            Despesa
                        </span>

                    </td>

                    <td>
                        ${valor}
                    </td>

                </tr>
            `;

        });


    } catch (erro) {

        console.error(
            "Erro inesperado ao carregar movimentações:",
            erro
        );


        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty">
                    Erro ao carregar movimentações.
                </td>
            </tr>
        `;

    }

}


// ==========================================
// CARTÕES COM MENOR SALDO
// ==========================================

function carregarCartoesMenorSaldo() {

    const tbody =
        document.getElementById(
            "tbodyCartoesMenorSaldo"
        );


    if (!tbody) {

        return;

    }


    const cartoes =
        typeof CartaoService !== "undefined"
            ? CartaoService.listar()
            : [];


    if (
        !cartoes ||
        cartoes.length === 0
    ) {

        tbody.innerHTML = `
            <tr>

                <td
                    colspan="2"
                    class="empty">

                    Nenhum cartão.

                </td>

            </tr>
        `;

        return;

    }


    const menores =
        [...cartoes]
            .sort(
                (
                    a,
                    b
                ) =>
                    Number(
                        a.saldo || 0
                    ) -
                    Number(
                        b.saldo || 0
                    )
            )
            .slice(
                0,
                5
            );


    tbody.innerHTML = "";


    menores.forEach(cartao => {

        const saldo =
            Number(
                cartao.saldo || 0
            ).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );


        tbody.innerHTML += `
            <tr>

                <td>

                    <strong>
                        ${cartao.funcionario}
                    </strong>

                    <br>

                    <small>
                        Final ${cartao.final}
                    </small>

                </td>

                <td>

                    <strong>
                        ${saldo}
                    </strong>

                </td>

            </tr>
        `;

    });

}
// ==========================================
// ÚLTIMAS MOVIMENTAÇÕES DO DASHBOARD
// ==========================================

async function carregarUltimasMovimentacoes() {

    const tbody =
        document.getElementById(
            "tbodyUltimasMovimentacoes"
        );


    if (!tbody) {

        return;

    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("movimentacoes")
            .select(`
                id,
                tipo,
                cartao_id,
                despesa_id,
                descricao,
                valor,
                data,
                criado_em
            `)
            .order(
                "criado_em",
                {
                    ascending: false
                }
            )
            .limit(5);


        if (error) {

            console.error(
                "Erro ao carregar últimas movimentações:",
                error
            );


            tbody.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        class="empty">
                        Erro ao carregar movimentações.
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

                    <td colspan="4">

                        <div class="empty-state">

                            <div class="empty-icon">
                                📄
                            </div>

                            <h3>
                                Nenhuma movimentação encontrada
                            </h3>

                            <p>
                                Quando houver lançamentos eles aparecerão aqui.
                            </p>

                        </div>

                    </td>

                </tr>
            `;

            return;

        }


        // ==========================================
        // CARTÕES
        // ==========================================

        const cartoes =
            typeof CartaoService !== "undefined"
                ? CartaoService.listar()
                : [];


        // ==========================================
        // MONTAR TABELA
        // ==========================================

        tbody.innerHTML =
            data
                .map(mov => {

                    const cartao =
                        cartoes.find(
                            c =>
                                Number(c.id) ===
                                Number(mov.cartao_id)
                        );


                    const funcionario =
                        cartao?.funcionario ||
                        "Cartão";


                    const dataMov =
                        mov.data ||
                        mov.criado_em;


                    const dataFormatada =
                        dataMov
                            ? new Date(
                                dataMov
                            ).toLocaleDateString(
                                "pt-BR"
                            )
                            : "-";


                    const valor =
                        Number(
                            mov.valor || 0
                        ).toLocaleString(
                            "pt-BR",
                            {
                                style: "currency",
                                currency: "BRL"
                            }
                        );


                    let tipo =
                        String(
                            mov.tipo || ""
                        ).toUpperCase();


                    let tipoTexto =
                        tipo;


                    if (
                        tipo === "APORTE"
                    ) {

                        tipoTexto =
                            "Aporte";

                    }


                    if (
                        tipo === "ESTORNO"
                    ) {

                        tipoTexto =
                            "Estorno";

                    }


                    if (
                        tipo === "DESPESA"
                    ) {

                        tipoTexto =
                            "Despesa";

                    }


                    return `
                        <tr>

                            <td>
                                ${dataFormatada}
                            </td>

                            <td>
                                ${funcionario}
                            </td>

                            <td>
                                ${tipoTexto}
                            </td>

                            <td>
                                ${valor}
                            </td>

                        </tr>
                    `;

                })
                .join("");


    } catch (erro) {

        console.error(
            "Erro inesperado ao carregar movimentações:",
            erro
        );


        tbody.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="empty">
                    Erro ao carregar movimentações.
                </td>
            </tr>
        `;

    }

}


// ==========================================
// CARTÕES COM MENOR SALDO
// ==========================================

function carregarCartoesMenorSaldo() {

    const tbody =
        document.getElementById(
            "tbodyCartoesMenorSaldo"
        );


    if (!tbody) {

        return;

    }


    const cartoes =
        typeof CartaoService !== "undefined"
            ? CartaoService.listar()
            : [];


    if (
        !cartoes ||
        cartoes.length === 0
    ) {

        tbody.innerHTML = `
            <tr>

                <td
                    colspan="2"
                    class="empty">

                    Nenhum cartão.

                </td>

            </tr>
        `;

        return;

    }


    // ==========================================
    // ORDENAR PELO MENOR SALDO
    // ==========================================

    const menores =
        [...cartoes]
            .sort(
                (
                    a,
                    b
                ) =>
                    Number(
                        a.saldo || 0
                    ) -
                    Number(
                        b.saldo || 0
                    )
            )
            .slice(
                0,
                5
            );


    tbody.innerHTML =
        menores
            .map(cartao => {

                const saldo =
                    Number(
                        cartao.saldo || 0
                    ).toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL"
                        }
                    );


                return `
                    <tr>

                        <td>

                            <strong>
                                ${cartao.funcionario}
                            </strong>

                        </td>

                        <td>

                            <strong>
                                ${saldo}
                            </strong>

                        </td>

                    </tr>
                `;

            })
            .join("");

}
// ==========================================
// ÚLTIMAS MOVIMENTAÇÕES
// ==========================================

async function carregarUltimasMovimentacoes() {

    const tbody =
        document.getElementById(
            "tbodyUltimasMovimentacoes"
        );


    if (!tbody) {

        return;

    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("movimentacoes")
            .select(`
                id,
                tipo,
                cartao_id,
                despesa_id,
                descricao,
                valor,
                data,
                criado_em
            `)
            .order(
                "criado_em",
                {
                    ascending: false
                }
            )
            .limit(10);


        // ==========================================
        // ERRO
        // ==========================================

        if (error) {

            console.error(
                "Erro ao carregar movimentações:",
                error
            );


            tbody.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        class="empty">

                        Erro ao carregar movimentações.

                    </td>
                </tr>
            `;

            return;

        }


        // ==========================================
        // SEM MOVIMENTAÇÕES
        // ==========================================

        if (
            !data ||
            data.length === 0
        ) {

            tbody.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        class="empty">

                        Nenhuma movimentação encontrada.

                    </td>
                </tr>
            `;

            return;

        }


        // ==========================================
        // CARTÕES
        // ==========================================

        const cartoes =
            typeof CartaoService !== "undefined"
                ? CartaoService.listar()
                : [];


        // ==========================================
        // MONTAR TABELA
        // ==========================================

        tbody.innerHTML =
            data
                .map(
                    movimentacao => {

                        // ==========================================
                        // CARTÃO
                        // ==========================================

                        const cartao =
                            cartoes.find(
                                item =>
                                    String(
                                        item.id
                                    ) ===
                                    String(
                                        movimentacao.cartao_id
                                    )
                            );


                        const funcionario =
                            cartao?.funcionario ||
                            "Não vinculado";


                        // ==========================================
                        // DATA
                        // ==========================================

                        const dataMov =
                            movimentacao.data ||
                            movimentacao.criado_em;


                        const dataFormatada =
                            dataMov
                                ? new Date(
                                    dataMov
                                ).toLocaleDateString(
                                    "pt-BR"
                                )
                                : "-";


                        // ==========================================
                        // TIPO
                        // ==========================================

                        const tipoOriginal =
                            String(
                                movimentacao.tipo ||
                                ""
                            ).toUpperCase();


                        let tipoTexto =
                            movimentacao.tipo ||
                            "-";


                        if (
                            tipoOriginal ===
                            "APORTE"
                        ) {

                            tipoTexto =
                                "Aporte";

                        }


                        else if (
                            tipoOriginal ===
                            "DESPESA"
                        ) {

                            tipoTexto =
                                "Despesa";

                        }


                        else if (
                            tipoOriginal ===
                            "ESTORNO"
                        ) {

                            tipoTexto =
                                "Estorno";

                        }


                        // ==========================================
                        // VALOR
                        // ==========================================

                        const valor =
                            Number(
                                movimentacao.valor ||
                                0
                            ).toLocaleString(
                                "pt-BR",
                                {
                                    style: "currency",
                                    currency: "BRL"
                                }
                            );


                        // ==========================================
                        // RETORNO
                        // ==========================================

                        return `
                            <tr>

                                <td>
                                    ${dataFormatada}
                                </td>

                                <td>
                                    ${funcionario}
                                </td>

                                <td>
                                    ${tipoTexto}
                                </td>

                                <td>
                                    ${valor}
                                </td>

                            </tr>
                        `;

                    }
                )
                .join("");


    } catch (erro) {

        console.error(
            "Erro inesperado ao carregar movimentações:",
            erro
        );


        tbody.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="empty">

                    Erro ao carregar movimentações.

                </td>
            </tr>
        `;

    }

}