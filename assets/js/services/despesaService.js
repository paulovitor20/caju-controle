// ==========================================
// DESPESA SERVICE
// ==========================================

const DespesaService = (() => {

    // ==========================================
    // MEMÓRIA LOCAL DA TELA
    // ==========================================

    let despesas = [];


    // ==========================================
    // LISTAR
    // ==========================================

    function listar() {

        return despesas;

    }


    // ==========================================
    // BUSCAR
    // ==========================================

    function buscar(id) {

        return despesas.find(
            despesa =>
                String(despesa.id) ===
                String(id)
        );

    }


    // ==========================================
    // CARREGAR DO SUPABASE
    // ==========================================

    async function carregar() {

        try {

            const {
                data,
                error
            } = await supabaseClient
                .from("despesas")
                .select("*")
                .order(
                    "data",
                    {
                        ascending: false
                    }
                );


            if (error) {

                console.error(
                    "Erro ao carregar despesas:",
                    error
                );


                despesas = [];

                return false;

            }


            despesas =
                (data || []).map(
                    despesa => ({

                        ...despesa,


                        // ==========================================
                        // COMPATIBILIDADE
                        // ==========================================

                        centroCusto:
                            despesa.centro_custo ??
                            despesa.centroCusto ??
                            "",


                        cartaoId:
                            despesa.cartao_id ??
                            despesa.cartaoId ??
                            null,


                        valor:
                            Number(
                                despesa.valor || 0
                            )

                    })
                );


            return true;


        } catch (erro) {

            console.error(
                "Erro inesperado ao carregar despesas:",
                erro
            );


            despesas = [];


            return false;

        }

    }


    // ==========================================
    // ADICIONAR
    // ==========================================

    async function adicionar(dados) {

        try {

            // ==========================================
            // VALIDAR CARTÃO
            // ==========================================

            if (!dados.cartaoId) {

                console.warn(
                    "Despesa cadastrada sem cartão."
                );

            }


            // ==========================================
            // DADOS DA DESPESA
            // ==========================================

            const registro = {

                fornecedor:
                    dados.fornecedor,


                categoria:
                    dados.categoria,


                centro_custo:
                    dados.centroCusto,


                cartao_id:
                    dados.cartaoId
                        ? Number(
                            dados.cartaoId
                        )
                        : null,


                valor:
                    Number(
                        dados.valor || 0
                    ),


                descricao:
                    dados.descricao,


                status:
                    "Pendente",


                data:
                    new Date().toISOString()

            };


            // ==========================================
            // SALVAR DESPESA
            // ==========================================

            const {
                data,
                error
            } = await supabaseClient
                .from("despesas")
                .insert(
                    registro
                )
                .select()
                .single();


            if (error) {

                console.error(
                    "Erro ao cadastrar despesa:",
                    error
                );


                toast(
                    error.message ||
                    "Erro ao cadastrar despesa.",
                    "error"
                );


                return null;

            }


            // ==========================================
            // PREPARAR DESPESA
            // ==========================================

            const despesa = {

                ...data,


                centroCusto:
                    data.centro_custo,


                cartaoId:
                    data.cartao_id,


                valor:
                    Number(
                        data.valor || 0
                    )

            };


            // ==========================================
            // ADICIONAR NA MEMÓRIA
            // ==========================================

            despesas.unshift(
                despesa
            );


            // ==========================================
            // USUÁRIO LOGADO
            // ==========================================

            let usuarioId = null;


            try {

                const {
                    data: usuarioData
                } =
                    await supabaseClient
                        .auth
                        .getUser();


                usuarioId =
                    usuarioData
                        ?.user
                        ?.id ||
                    null;

            } catch (erroUsuario) {

                console.warn(
                    "Não foi possível identificar o usuário:",
                    erroUsuario
                );

            }


            // ==========================================
            // REGISTRAR MOVIMENTAÇÃO
            // ==========================================

            const movimentacao = {

                tipo:
                    "DESPESA",


                cartao_id:
                    data.cartao_id
                        ? Number(
                            data.cartao_id
                        )
                        : null,


                despesa_id:
                    data.id,


                descricao:
                    data.descricao ||
                    `Despesa - ${data.fornecedor || ""}`.trim(),


                valor:
                    Number(
                        data.valor || 0
                    ),


                data:
                    data.data ||
                    new Date().toISOString(),


                usuario_id:
                    usuarioId

            };


            const {
                data: movimentacaoData,
                error: movimentacaoError
            } = await supabaseClient
                .from("movimentacoes")
                .insert(
                    movimentacao
                )
                .select()
                .single();


            // ==========================================
            // ERRO NA MOVIMENTAÇÃO
            // ==========================================

            if (movimentacaoError) {

                console.error(
                    "Despesa cadastrada, mas erro ao registrar movimentação:",
                    movimentacaoError
                );


                toast(
                    "Despesa cadastrada, mas não foi possível registrar a movimentação.",
                    "warning"
                );


                // A despesa já foi salva.
                // Não vamos apagá-la automaticamente.

            } else {

                console.log(
                    "Movimentação de despesa registrada:",
                    movimentacaoData
                );

            }


            // ==========================================
            // SUCESSO
            // ==========================================

            return despesa;


        } catch (erro) {

            console.error(
                "Erro inesperado ao cadastrar despesa:",
                erro
            );


            toast(
                "Erro inesperado ao cadastrar despesa.",
                "error"
            );


            return null;

        }

    }


    // ==========================================
    // REMOVER
    // ==========================================

    async function remover(id) {

        try {

            const {
                error
            } = await supabaseClient
                .from("despesas")
                .delete()
                .eq(
                    "id",
                    id
                );


            if (error) {

                console.error(
                    "Erro ao remover despesa:",
                    error
                );


                return false;

            }


            despesas =
                despesas.filter(
                    despesa =>
                        String(
                            despesa.id
                        ) !==
                        String(id)
                );


            return true;


        } catch (erro) {

            console.error(
                "Erro inesperado ao remover despesa:",
                erro
            );


            return false;

        }

    }


    // ==========================================
    // ATUALIZAR
    // ==========================================

    async function atualizar(
        id,
        dados
    ) {

        try {

            const registro = {};


            // ==========================================
            // FORNECEDOR
            // ==========================================

            if (
                dados.fornecedor !==
                undefined
            ) {

                registro.fornecedor =
                    dados.fornecedor;

            }


            // ==========================================
            // CATEGORIA
            // ==========================================

            if (
                dados.categoria !==
                undefined
            ) {

                registro.categoria =
                    dados.categoria;

            }


            // ==========================================
            // CENTRO DE CUSTO
            // ==========================================

            if (
                dados.centroCusto !==
                undefined
            ) {

                registro.centro_custo =
                    dados.centroCusto;

            }


            // ==========================================
            // CARTÃO
            // ==========================================

            if (
                dados.cartaoId !==
                undefined
            ) {

                registro.cartao_id =
                    dados.cartaoId
                        ? Number(
                            dados.cartaoId
                        )
                        : null;

            }


            // ==========================================
            // VALOR
            // ==========================================

            if (
                dados.valor !==
                undefined
            ) {

                registro.valor =
                    Number(
                        dados.valor || 0
                    );

            }


            // ==========================================
            // DESCRIÇÃO
            // ==========================================

            if (
                dados.descricao !==
                undefined
            ) {

                registro.descricao =
                    dados.descricao;

            }


            // ==========================================
            // STATUS
            // ==========================================

            if (
                dados.status !==
                undefined
            ) {

                registro.status =
                    dados.status;

            }


            // ==========================================
            // ATUALIZAR DESPESA
            // ==========================================

            const {
                data,
                error
            } = await supabaseClient
                .from("despesas")
                .update(
                    registro
                )
                .eq(
                    "id",
                    id
                )
                .select()
                .single();


            if (error) {

                console.error(
                    "Erro ao atualizar despesa:",
                    error
                );


                return null;

            }


            // ==========================================
            // PREPARAR OBJETO
            // ==========================================

            const despesa = {

                ...data,


                centroCusto:
                    data.centro_custo,


                cartaoId:
                    data.cartao_id,


                valor:
                    Number(
                        data.valor || 0
                    )

            };


            // ==========================================
            // ATUALIZAR MEMÓRIA
            // ==========================================

            const indice =
                despesas.findIndex(
                    item =>
                        String(
                            item.id
                        ) ===
                        String(id)
                );


            if (
                indice !== -1
            ) {

                despesas[indice] =
                    despesa;

            }


            return despesa;


        } catch (erro) {

            console.error(
                "Erro inesperado ao atualizar despesa:",
                erro
            );


            return null;

        }

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

        atualizar

    };

})();