const btn_solicitar = document.querySelector('.solicitud');

btn_solicitar.addEventListener('click', () => {

    window.location.href = "confirmación.html";

});

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

    let carrito = JSON.parse(localStorage.getItem("carritoServicios")) || [];

    const cajas = document.querySelectorAll('.desactivado');
    const num_carrito = document.querySelector('.num_carrito');

    num_carrito.innerHTML = carrito.length;
   

    cajas.forEach(caja => {
        if (carrito.includes(caja.id)) {
            caja.classList.add("activado");
            caja.classList.remove("desactivado");
        }
    });

        cajas.forEach(caja => {
            caja.addEventListener("click", function () {

                const id = this.id;

                if (carrito.includes(id)) {

                    // Quitar
                    carrito = carrito.filter(serv => serv !== id);
                    this.classList.remove("activado");
                    this.classList.add("desactivado");

                } else {

                    // Agregar
                    carrito.push(id);
                    this.classList.remove("desactivado");
                    this.classList.add("activado");
                }

                // Guardar cambios
                localStorage.setItem("carritoServicios", JSON.stringify(carrito));

                num_carrito.textContent = carrito.length;
                console.log("Carrito actualizado:", carrito);
            });
        });

    } catch (error) {
        console.error("Error al mostrar servicios:", error);
    }
}

mostrarServicios();
