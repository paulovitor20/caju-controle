// ======================================================
// CAJU CONTROL
// AUTENTICAÇÃO
// ======================================================

const AuthService = (() => {

    // ==================================================
    // LOGIN COM E-MAIL E SENHA
    // ==================================================

    async function login(email, senha) {

        try {

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email.trim(),
                    password: senha
                });

            if (error) {

                console.error(
                    "Erro no login:",
                    error
                );

                return {
                    sucesso: false,
                    erro: error.message
                };

            }

            return {
                sucesso: true,
                usuario: data.user
            };

        } catch (erro) {

            console.error(
                "Erro inesperado no login:",
                erro
            );

            return {
                sucesso: false,
                erro: erro.message
            };
        }
    }


    // ==================================================
    // LOGIN COM GOOGLE
    // ==================================================

    async function loginGoogle() {

        try {

            const { data, error } =
                await supabaseClient.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                        redirectTo:
                            `${window.location.origin}/pages/login.html`
                    }
                });

            if (error) {

                console.error(
                    "Erro no login Google:",
                    error
                );

                return {
                    sucesso: false,
                    erro: error.message
                };

            }

            return {
                sucesso: true,
                data: data
            };

        } catch (erro) {

            console.error(
                "Erro inesperado no Google:",
                erro
            );

            return {
                sucesso: false,
                erro: erro.message
            };
        }
    }


    // ==================================================
    // CADASTRO
    // ==================================================

    async function cadastrar(
        nome,
        email,
        senha
    ) {

        try {

            const { data, error } =
                await supabaseClient.auth.signUp({

                    email: email.trim(),

                    password: senha,

                    options: {

                        data: {
                            nome: nome.trim()
                        }

                    }

                });


            if (error) {

                console.error(
                    "Erro no cadastro:",
                    error
                );

                return {
                    sucesso: false,
                    erro: error.message
                };

            }


            // ==========================================
            // COMO CONFIGURAMOS O SISTEMA PARA NÃO
            // EXIGIR CONFIRMAÇÃO DE E-MAIL,
            // O USUÁRIO PODERÁ ENTRAR DIRETAMENTE.
            // ==========================================

            return {
                sucesso: true,
                usuario: data.user,
                sessao: data.session
            };

        } catch (erro) {

            console.error(
                "Erro inesperado no cadastro:",
                erro
            );

            return {
                sucesso: false,
                erro: erro.message
            };
        }
    }


    // ==================================================
    // RESET DE SENHA
    // ==================================================

    async function resetarSenha(email) {

        try {

            const { error } =
                await supabaseClient.auth
                    .resetPasswordForEmail(
                        email.trim(),
                        {

                            redirectTo:
                                `${window.location.origin}/reset-password.html`

                        }
                    );


            if (error) {

                console.error(
                    "Erro ao solicitar recuperação:",
                    error
                );

                return {
                    sucesso: false,
                    erro: error.message
                };

            }


            return {
                sucesso: true
            };

        } catch (erro) {

            console.error(
                "Erro inesperado no reset:",
                erro
            );

            return {
                sucesso: false,
                erro: erro.message
            };
        }
    }


    // ==================================================
    // LOGOUT
    // ==================================================

    async function logout() {

        try {

            const { error } =
                await supabaseClient.auth.signOut();

            if (error) {

                console.error(
                    "Erro ao sair:",
                    error
                );

                return false;
            }

            return true;

        } catch (erro) {

            console.error(
                "Erro inesperado ao sair:",
                erro
            );

            return false;
        }
    }


    // ==================================================
    // USUÁRIO ATUAL
    // ==================================================

    async function usuarioAtual() {

        try {

            const {
                data: { user },
                error
            } =
                await supabaseClient.auth.getUser();


            if (error) {

                console.error(
                    "Erro ao buscar usuário:",
                    error
                );

                return null;
            }


            return user;

        } catch (erro) {

            console.error(
                "Erro inesperado ao buscar usuário:",
                erro
            );

            return null;
        }
    }


    // ==================================================
    // VERIFICAR AUTENTICAÇÃO
    // ==================================================

    async function estaAutenticado() {

        const usuario =
            await usuarioAtual();

        return !!usuario;

    }


    // ==================================================
    // RETORNO PÚBLICO
    // ==================================================

    return {

        login,
        loginGoogle,
        cadastrar,
        resetarSenha,
        logout,
        usuarioAtual,
        estaAutenticado

    };

})();