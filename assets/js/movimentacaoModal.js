function abrirModalMovimentacao(){

    document
        .getElementById("modalMovimentacao")
        .classList.add("show");

}

function fecharModalMovimentacao(){

    document
        .getElementById("modalMovimentacao")
        .classList.remove("show");

}

function trocarFormulario(){

    const tipo=document.getElementById("tipoMovimentacao").value;

    const div=document.getElementById("formMovimentacao");

    if(tipo==="aporte"){

        div.innerHTML=`

            <div class="form-group">

                <label>Cartão</label>

                <select>

                    <option>Selecione...</option>

                </select>

            </div>

            <div class="form-group">

                <label>Valor</label>

                <input type="number">

            </div>

            <div class="form-group">

                <label>Observação</label>

                <textarea rows="3"></textarea>

            </div>

        `;

    }

    if(tipo==="despesa"){

        div.innerHTML=`

            <div class="form-group">

                <label>Cartão</label>

                <select>

                    <option>Selecione...</option>

                </select>

            </div>

            <div class="form-group">

                <label>Fornecedor</label>

                <input type="text">

            </div>

            <div class="form-group">

                <label>Categoria</label>

                <select>

                    <option>Selecione...</option>

                </select>

            </div>

            <div class="form-group">

                <label>Valor</label>

                <input type="number">

            </div>

        `;

    }

    if(tipo==="estorno"){

        div.innerHTML=`

            <div class="form-group">

                <label>Cartão</label>

                <select>

                    <option>Selecione...</option>

                </select>

            </div>

            <div class="form-group">

                <label>Valor</label>

                <input type="number">

            </div>

            <div class="form-group">

                <label>Motivo</label>

                <textarea rows="3"></textarea>

            </div>

        `;

    }

    if(tipo==="ajuste"){

        div.innerHTML=`

            <div class="form-group">

                <label>Conta/Cartão</label>

                <select>

                    <option>Conta CAJU</option>

                    <option>Cartão</option>

                </select>

            </div>

            <div class="form-group">

                <label>Novo Saldo</label>

                <input type="number">

            </div>

            <div class="form-group">

                <label>Motivo</label>

                <textarea rows="3"></textarea>

            </div>

        `;

    }

}