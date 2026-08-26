async function carregarSaldoContaCaju() {
    try {

        const { data, error } = await supabaset
            .from('conta_caju')
            .select('saldo')
            .eq('id', 1)
            .maybeSingle();

        if (error) {
            console.error(
                'Erro ao buscar saldo da Conta CAJU:',
                error
            );
            return;
        }

        console.log(
            'Dados da Conta CAJU:',
            data
        );

        if (!data) {
            console.error(
                'Registro da Conta CAJU não encontrado.'
            );
            return;
        }

        const saldo = Number(data.saldo || 0);

        const elementoSaldo =
            document.getElementById('saldoAtual');

        if (!elementoSaldo) {
            console.error(
                'Elemento #saldoAtual não encontrado no HTML.'
            );
            return;
        }

        elementoSaldo.textContent =
            saldo.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

        console.log(
            'Saldo atual carregado:',
            saldo
        );

    } catch (erro) {

        console.error(
            'Erro inesperado ao carregar saldo:',
            erro
        );

    }
}


document.addEventListener(
    'DOMContentLoaded',
    () => {

        carregarSaldoContaCaju();

    }
);