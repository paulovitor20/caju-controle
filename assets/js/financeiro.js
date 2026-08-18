const Financeiro = {

    conta: {
        saldoInicial: 0
    },

    cartoes: [],

    movimentacoes: [],

    adicionarCartao(cartao){

        this.cartoes.push(cartao);

    },

    adicionarMovimentacao(mov){

        mov.id = Date.now();

        this.movimentacoes.push(mov);

    },

    listarMovimentacoes(){

        return this.movimentacoes;

    }

};
Financeiro.saldoConta = function(){

    let saldo = this.conta.saldoInicial;

    this.movimentacoes.forEach(m=>{

        if(m.tipo=="APORTE"){

            saldo -= m.valor;

        }

        if(m.tipo=="ESTORNO"){

            saldo += m.valor;

        }

        if(m.tipo=="AJUSTE_CONTA"){

            saldo += m.valor;

        }

    });

    return saldo;

}
Financeiro.saldoCartao = function(idCartao){

    let saldo = 0;

    this.movimentacoes.forEach(m=>{

        if(m.cartao==idCartao){

            if(m.tipo=="APORTE"){

                saldo+=m.valor;

            }

            if(m.tipo=="DESPESA"){

                saldo-=m.valor;

            }

            if(m.tipo=="ESTORNO"){

                saldo-=m.valor;

            }

        }

    });

    return saldo;

}
Financeiro.extratoCartao=function(id){

    return this.movimentacoes.filter(m=>m.cartao==id);

}
Financeiro.conta.saldoInicial=10000;

Financeiro.adicionarCartao({

    id:1,

    funcionario:"João"

});

Financeiro.adicionarMovimentacao({

    tipo:"APORTE",

    cartao:1,

    valor:2000

});

Financeiro.adicionarMovimentacao({

    tipo:"DESPESA",

    cartao:1,

    valor:350

});

console.log(

Financeiro.saldoConta()

);

console.log(

Financeiro.saldoCartao(1)

);

console.log(

Financeiro.extratoCartao(1)

);