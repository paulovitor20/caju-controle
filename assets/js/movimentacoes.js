// ==========================================
// MOVIMENTAÇÕES FINANCEIRAS
// ==========================================

const MovimentacaoService = (() => {

    let movimentacoes = [];


    // ==========================================
    // LISTAR MOVIMENTAÇÕES
    // ==========================================

    function listar() {

        return [...movimentacoes];

    }


    // ==========================================
    // CARREGAR MOVIMENTAÇÕES DO SUPABASE
    // ==========================================

    async function carregar() {

        try {

            const {
                data,
                error
            } = await supabaseClient
                .from("movimentacoes")
                .select(`
                    id,
                    criado_em,
                    tipo,
                    cartao_id,
                    descricao,
                    valor
                `)
                .order(
                    "criado_em",
                    {
                        ascending: false
                    }
                );


            if (error) {

                console.error(
                    "Erro ao carregar movimentações:",
                    error
                );

                movimentacoes = [];

                return false;

            }


            movimentacoes =
                (data || []).map(item => ({

                    id:
                        item.id,

                    data:
                        item.criado_em
                            ? new Date(
                                item.criado_em
                            )
                            : new Date(),

                    tipo:
                        item.tipo,

                    cartaoId:
                        item.cartao_id,

                    descricao:
                        item.descricao || "",

                    valor:
                        Number(
                            item.valor || 0
                        )

                }));


            return true;


        } catch (erro) {

            console.error(
                "Erro inesperado ao carregar movimentações:",
                erro
            );


            movimentacoes = [];


            return false;

        }

    }


    // ==========================================
    // REGISTRAR MOVIMENTAÇÃO
    // ==========================================

    async function registrar(dados) {

        try {

            const {
                data,
                error
            } = await supabaseClient
                .from("movimentacoes")
                .insert({

                    tipo:
                        dados.tipo,

                    cartao_id:
                        dados.cartaoId ||
                        null,

                    descricao:
                        dados.descricao ||
                        null,

                    valor:
                        Number(
                            dados.valor || 0
                        )

                })
                .select(`
                    id,
                    criado_em,
                    tipo,
                    cartao_id,
                    descricao,
                    valor
                `)
                .single();


            if (error) {

                console.error(
                    "Erro ao registrar movimentação:",
                    error
                );


                return null;

            }


            const movimentacao = {

                id:
                    data.id,

                data:
                    data.criado_em
                        ? new Date(
                            data.criado_em
                        )
                        : new Date(),

                tipo:
                    data.tipo,

                cartaoId:
                    data.cartao_id,

                descricao:
                    data.descricao || "",

                valor:
                    Number(
                        data.valor || 0
                    )

            };


            movimentacoes.unshift(
                movimentacao
            );


            return movimentacao;


        } catch (erro) {

            console.error(
                "Erro inesperado ao registrar movimentação:",
                erro
            );


            return null;

        }

    }


    // ==========================================
    // OBTER ÚLTIMAS MOVIMENTAÇÕES
    // ==========================================

    function ultimas(limite = 5) {

        return movimentacoes
            .slice(
                0,
                limite
            );

    }


    // ==========================================
    // FILTRAR
    // ==========================================

    function filtrar(filtros = {}) {

        return movimentacoes.filter(
            mov => {

                // ==========================================
                // TIPO
                // ==========================================

                if (
                    filtros.tipo &&
                    String(
                        mov.tipo
                    ).toUpperCase() !==
                    String(
                        filtros.tipo
                    ).toUpperCase()
                ) {

                    return false;

                }


                // ==========================================
                // CARTÃO
                // ==========================================

                if (
                    filtros.cartaoId &&
                    String(
                        mov.cartaoId
                    ) !==
                    String(
                        filtros.cartaoId
                    )
                ) {

                    return false;

                }


                // ==========================================
                // DATA INICIAL
                // ==========================================

                if (
                    filtros.dataInicial
                ) {

                    const inicio =
                        new Date(
                            `${filtros.dataInicial}T00:00:00`
                        );


                    const dataMov =
                        new Date(
                            mov.data
                        );


                    if (
                        dataMov <
                        inicio
                    ) {

                        return false;

                    }

                }


                // ==========================================
                // DATA FINAL
                // ==========================================

                if (
                    filtros.dataFinal
                ) {

                    const fim =
                        new Date(
                            `${filtros.dataFinal}T23:59:59`
                        );


                    const dataMov =
                        new Date(
                            mov.data
                        );


                    if (
                        dataMov >
                        fim
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );

    }


    // ==========================================
    // RETORNO PÚBLICO
    // ==========================================

    return {

        listar,

        carregar,

        registrar,

        ultimas,

        filtrar

    };

})();


// ==========================================
// RENDERIZAR TABELA DE MOVIMENTAÇÕES
// ==========================================

function renderizarMovimentacoes(
    lista = null
) {

    const tbody =
        document.getElementById(
            "tbodyMovimentacoes"
        );


    if (!tbody) {

        return;

    }


    const dados =
        lista !== null
            ? lista
            : MovimentacaoService.listar();


    if (
        !dados ||
        dados.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td colspan="7">

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
    // RENDERIZAR
    // ==========================================

    tbody.innerHTML =
        dados
            .map(mov => {

                const data =
                    new Date(
                        mov.data
                    );


                const dataFormatada =
                    data.toLocaleDateString(
                        "pt-BR"
                    );


                const valorFormatado =
                    Number(
                        mov.valor || 0
                    ).toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL"
                        }
                    );


                // ==========================================
                // CARTÃO
                // ==========================================

                const cartao =
                    cartoes.find(
                        c =>
                            Number(c.id) ===
                            Number(mov.cartaoId)
                    );


                const funcionario =
                    cartao?.funcionario ||
                    (
                        mov.cartaoId
                            ? `Cartão #${mov.cartaoId}`
                            : "-"
                    );


                // ==========================================
                // ORIGEM / DESTINO
                // ==========================================

                let origem =
                    "-";


                let destino =
                    "-";


                if (
                    String(
                        mov.tipo
                    ).toUpperCase() ===
                    "APORTE"
                ) {

                    origem =
                        "Conta CAJU";

                    destino =
                        funcionario;

                }


                else if (
                    String(
                        mov.tipo
                    ).toUpperCase() ===
                    "ESTORNO"
                ) {

                    origem =
                        funcionario;

                    destino =
                        "Conta CAJU";

                }


                else if (
                    String(
                        mov.tipo
                    ).toUpperCase() ===
                    "DESPESA"
                ) {

                    origem =
                        funcionario;

                    destino =
                        "Despesa";

                }


                else if (
                    String(
                        mov.tipo
                    ).toUpperCase() ===
                    "AJUSTE"
                ) {

                    origem =
                        "Sistema";

                    destino =
                        funcionario;

                }


                return `

                    <tr>

                        <td>
                            ${dataFormatada}
                        </td>

                        <td>
                            ${mov.tipo || "-"}
                        </td>

                        <td>
                            ${origem}
                        </td>

                        <td>
                            ${destino}
                        </td>

                        <td>
                            ${mov.descricao || "-"}
                        </td>

                        <td>
                            ${valorFormatado}
                        </td>

                        <td>
                            Usuário atual
                        </td>

                    </tr>

                `;

            })
            .join("");

}


// ==========================================
// FILTRAR MOVIMENTAÇÕES
// ==========================================

function filtrarMovimentacoes() {

    const tipo =
        document.getElementById(
            "filtroTipo"
        )?.value || "";


    const cartaoId =
        document.getElementById(
            "filtroCartao"
        )?.value || "";


    const dataInicial =
        document.getElementById(
            "dataInicial"
        )?.value || "";


    const dataFinal =
        document.getElementById(
            "dataFinal"
        )?.value || "";


    const filtradas =
        MovimentacaoService.filtrar({

            tipo,

            cartaoId,

            dataInicial,

            dataFinal

        });


    renderizarMovimentacoes(
        filtradas
    );

}


// ==========================================
// PREENCHER FILTRO DE CARTÕES
// ==========================================

function preencherFiltroCartoes() {

    const select =
        document.getElementById(
            "filtroCartao"
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            Todos os Cartões
        </option>

    `;


    const cartoes =
        typeof CartaoService !== "undefined"
            ? CartaoService.listar()
            : [];


    cartoes.forEach(
        cartao => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                cartao.id;


            option.textContent =
                `${cartao.funcionario} — Final ${cartao.final}`;


            select.appendChild(
                option
            );

        }
    );

}


// ==========================================
// CARREGAR TELA DE MOVIMENTAÇÕES
// ==========================================

async function carregarTelaMovimentacoes() {

    try {

        // ==========================================
        // CARTÕES
        // ==========================================

        if (
            typeof CartaoService !==
            "undefined"
        ) {

            await CartaoService.carregar();

        }


        // ==========================================
        // FILTRO
        // ==========================================

        preencherFiltroCartoes();


        // ==========================================
        // MOVIMENTAÇÕES
        // ==========================================

        await MovimentacaoService.carregar();


        // ==========================================
        // RENDERIZAR
        // ==========================================

        renderizarMovimentacoes();


    } catch (erro) {

        console.error(
            "Erro ao carregar tela de movimentações:",
            erro
        );

    }

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarTelaMovimentacoes();

    }
);