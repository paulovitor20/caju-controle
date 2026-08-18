function toast(mensagem,tipo="info"){

    let container=document.querySelector(".toast-container");

    if(!container){

        container=document.createElement("div");

        container.className="toast-container";

        document.body.appendChild(container);

    }

    const div=document.createElement("div");

    div.className=`toast toast-${tipo}`;

    div.innerHTML=mensagem;

    container.appendChild(div);

    setTimeout(()=>{

        div.remove();

    },3000);

}