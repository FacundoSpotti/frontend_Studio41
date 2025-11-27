const btn_solicitar = document.querySelector('.solicitud');

let carrito = JSON.parse(localStorage.getItem("carritoServicios")) || [];

btn_solicitar.addEventListener('click', () => {

    localStorage.setItem("carritoServicios", JSON.stringify(carrito));
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

        cargaDinamica(contenedorServicios, `<div class="project-grid">${cadaServicio}</div>`);

        const cajas = document.querySelectorAll('.project');
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
                    carrito = carrito.filter(item => item !== id);
                    this.classList.remove("activado");
                    this.classList.add("desactivado");
                } else {
                    carrito.push(id);
                    this.classList.remove("desactivado");
                    this.classList.add("activado");
                }

                num_carrito.textContent = carrito.length;
                console.log("Carrito actualizado:", carrito);

            });
        });

    } catch (error) {
        console.error("Error al mostrar servicios:", error);
    }
}

mostrarServicios();
