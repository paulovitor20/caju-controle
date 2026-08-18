const AuthGuard = (() => {

    async function protegerPagina() {

        const {
            data: { user },
            error
        } = await supabaseClient.auth.getUser();


        if (error || !user) {

            window.location.replace("login.html");

            return false;

        }


        return true;

    }


    return {

        protegerPagina

    };

})();