// ==========================================
// CARTAO SERVICE
// ==========================================

const CartaoService = (() => {

    let cartoes = [];


    // ==========================================
    // LISTAR
    // ==========================================

    function listar() {

        return cartoes;

    }


    // ==========================================
    // BUSCAR
    // ==========================================

    function buscar(id) {

        return cartoes.find(
            cartao =>
                String(cartao.id) === String(id)
        );

    }

async function carregar() {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("cartoes")
            .select(`
                *,
                despesas:despesas!despesas_cartao_id_fkey(
                    id,
                    valor,
                    status,
                    data,
                    descricao,
                    categoria
                )
            `)
            .order("id", {
                ascending: true
            });


        if (error) {

            console.error(
                "Erro ao carregar cartões:",
                error
            );

            cartoes = [];

            return false;

        }


        cartoes =
            (data || []).map(cartao => {

                const despesas =
                    cartao.despesas || [];


                const despesasPendentes =
                    despesas.filter(
                        despesa =>
                            despesa.status ===
                            "Pendente"
                    );


                const totalDespesasPendentes =
                    despesasPendentes.reduce(
                        (
                            total,
                            despesa
                        ) => {

                            return total +
                                Number(
                                    despesa.valor || 0
                                );

                        },
                        0
                    );


                return {

                    ...cartao,

                    saldo:
                        Number(
                            cartao.saldo || 0
                        ),

                    despesas,

                    despesasPendentes,

                    totalDespesasPendentes

                };

            });


        return true;


    } catch (erro) {

        console.error(
            "Erro inesperado ao carregar cartões:",
            erro
        );

        cartoes = [];

        return false;

    }

}

    // ==========================================
    // ADICIONAR
    // ==========================================

    function adicionar(dados) {

        const cartao = {

            id:
                dados.id ??
                Date.now(),

            funcionario:
                dados.funcionario,

            final:
                dados.final,

            centroCusto:
                dados.centroCusto,

            saldo:
                Number(
                    dados.saldo || 0
                ),

            status:
                dados.status ||
                "Ativo"

        };


        cartoes.push(cartao);


        return cartao;

    }


    // ==========================================
    // REMOVER LOCAL
    // ==========================================

    function remover(id) {

        cartoes =
            cartoes.filter(
                cartao =>
                    String(cartao.id) !==
                    String(id)
            );

    }


    // ==========================================
    // ATUALIZAR LOCAL
    // ==========================================

    function atualizar(id, dados) {

        const cartao =
            buscar(id);


        if (!cartao) {

            return;

        }


        Object.assign(
            cartao,
            dados
        );

    }


    // ==========================================
    // ALTERAR SALDO LOCAL
    // ==========================================
    // NÃO USAR PARA OPERAÇÕES FINANCEIRAS.
    // As alterações reais devem ocorrer no Supabase.

    function alterarSaldo(id, valor) {

        const cartao =
            buscar(id);


        if (!cartao) {

            return;

        }


        cartao.saldo +=
            Number(valor);

    }


    // ==========================================
    // RETORNO
    // ==========================================

    return {

        listar,

        buscar,

        carregar,

        adicionar,

        remover,

        atualizar,

        alterarSaldo

    };

})();