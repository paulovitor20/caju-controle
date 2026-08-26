async function carregarSaldoContaCaju() {
    try {
        const { data, error } = await supabase
            .from('conta_caju')
            .select('saldo')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('Erro ao buscar saldo da Conta CAJU:', error);
            return;
        }

        if (!data) {
            console.error('Nenhum registro encontrado na conta_caju.');
            return;
        }

        const saldo = Number(data.saldo || 0);

        const elementoSaldo = document.getElementById('saldoAtual');

        if (!elementoSaldo) {
            console.error('Elemento #saldoAtual não encontrado no HTML.');
            return;
        }

        elementoSaldo.textContent = saldo.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        console.log('Saldo da Conta CAJU carregado:', saldo);

    } catch (erro) {
        console.error('Erro inesperado ao carregar saldo:', erro);
    }
}
document.addEventListener('DOMContentLoaded', () => {

    carregarSaldoContaCaju();

});