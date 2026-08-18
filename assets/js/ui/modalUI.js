function abrirModal(id){

    const modal = document.getElementById(id);

    if(!modal) return;

    modal.style.display = "flex";

}

function fecharModal(id){

    const modal = document.getElementById(id);

    if(!modal) return;

    modal.style.display = "none";

}

window.addEventListener("click",(e)=>{

    if(e.target.classList.contains("modal")){

        e.target.style.display="none";

    }

});