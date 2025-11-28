const btn_solicitar = document.querySelector('.solicitud');

let carrito = [];

btn_solicitar.addEventListener('click', btnSolicitar);

function btnSolicitar () {
    const seleccionados = [...document.querySelectorAll(".activado")]
        .map(serv => serv.id);

    if (seleccionados.length === 0) {
        alert("Debes seleccionar al menos un servicio");
        return;
    }

    localStorage.setItem("carritoServicios", JSON.stringify(seleccionados));
    window.location.href = "confirmación.html";
};


async function mostrarServicios() { 

    try {

    const contenedorServicios = document.querySelector('#servicios');
    const servicios = await cargarServicios();

    let cadaServicio = '';

    servicios.forEach(servicio => {

        cadaServicio +=
        
                `<article id=${servicio.id} class="project project--small desactivado">

                        <div class="project_img ${servicio.id} ${servicio.ref}">
                        
                        <style>
                            .${servicio.ref} {
                                background-image: url(${servicio.image});
                                background-size: cover;
                                background-position: center; 
                                background-repeat: no-repeat;

                                display: flex;
                                justify-content: center;
                                align-items: center;
                                color: white;
                                font-weight: bold;
                                text-align: center;
                            }
                        </style>

                            <h2>${servicio.titulo} | ${servicio.categoria}</h2>
                        
                        </div>

                        <div class="project_info project_info--small">
                            <span class="project_label">${servicio.plan}</span>
                            <span class="project_label">${servicio.precio}${servicio.moneda}</span>
                        </div>

                </article>`
                    
        });

    const contenidoServicios = `

            <div class="project-grid">

                ${cadaServicio}

            </div>`;

    cargaDinamica(contenedorServicios, contenidoServicios);

    const cajas = document.querySelectorAll('.desactivado');
    const num_carrito = document.querySelector('.num_carrito');

    num_carrito.innerHTML = carrito.length;

    cajas.forEach(caja => {
        caja.addEventListener("click", function () {
            this.classList.toggle("activado");
            this.classList.toggle("desactivado");
        });
    });

    } catch (error) {
        console.error("Error al mostrar servicios:", error);
    }
}

mostrarServicios();
