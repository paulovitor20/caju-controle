const AuthService = (() => {

    async function login(email, senha) {

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: senha
            });

        if (error) {

            return {
                sucesso: false,
                erro: error.message
            };

        }

        return {
            sucesso: true,
            usuario: data.user
        };

    }


    async function logout() {

        const { error } =
            await supabaseClient.auth.signOut();

        if (error) {

            return false;

        }

        return true;

    }


    async function usuarioAtual() {

        const {
            data: { user }
        } = await supabaseClient.auth.getUser();

        return user;

    }


    async function estaAutenticado() {

        const usuario =
            await usuarioAtual();

        return !!usuario;

    }


    return {

        login,
        logout,
        usuarioAtual,
        estaAutenticado

    };

})();