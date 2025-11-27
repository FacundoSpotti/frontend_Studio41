async function mostrarServicios() { 

    try {

    const contenedorServicios = document.querySelector('#servicios');

    const servicios = await cargarServicios();

    let cadaServicio = '';

    servicios.forEach(servicio => {

        cadaServicio +=
        
                `<article id=${servicio.id} class="project project--small desactivado">
                        <div class="project_img ${servicio.id}">
                        
                        <style>
                            .${servicio.id} {
                                background-image: url(${servicio.image});
                            }
                        </style>
                        
                        </div>

                        <div class="project_info project_info--small">
                            <span class="project_label">${servicio.plan}</span>
                            <span class="project_label">${servicio.titulo}</span>
                            <span class="project_label">${servicio.precio}${servicio.moneda}</span>
                            <p>${servicio.descripcion}</p>
                        </div>

                </article>`
                    
        });

    const contenidoServicios = `

            <div class="project-grid">

                ${cadaServicio}

            </div>`;

    cargaDinamica(contenedorServicios, contenidoServicios);

    let contador = 0;
    const num_carrito = document.querySelector('.num_carrito');
    const cajas = document.querySelectorAll('.desactivado');
    let carrito = [];

    cajas.forEach(caja => {

        caja.addEventListener("click", function() {

            let id = this.id;

            if(this.classList.contains("activado")) {

                this.classList.remove("activado");
                this.classList.add("desactivado");
                contador--;
                num_carrito.innerHTML = contador;

                carrito = carrito.filter(serv => serv !== servicios[id-1].id);

                console.log(carrito);
                return;

            } else{
            
                
                carrito.push(servicios[id-1].id);
                contador++;
                num_carrito.innerHTML = contador;

                this.classList.remove("desactivado");
                this.classList.add("activado");

                console.log(carrito);

            }


        });

    });

}
    
    catch (error) {

        console.error("Error al mostrar servicios:", error);

    }
}

mostrarServicios();

//////////////////////////////////GUARDAR SERVICIOS ESCOGIDOS///////////////////////////////
